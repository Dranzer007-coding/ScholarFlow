const prisma = require('../config/database');
const documentAgent = require('../agents/document.agent');
const eligibilityAgent = require('../agents/eligibility.agent');
const fraudAgent = require('../agents/fraud.agent');
const officerAgent = require('../agents/officer.agent');
const notificationAgent = require('../agents/notification.agent');

/**
 * Executes the entire automated AI pipeline for a submitted application.
 * 
 * SUBMITTED -> DOCUMENT_VERIFICATION -> ELIGIBILITY_CHECK -> FRAUD_DETECTION -> OFFICER_REVIEW
 * 
 * @param {string} applicationId Application ID to process
 */
const processApplication = async (applicationId) => {
  console.log(`[WORKFLOW START] Processing application ${applicationId}`);
  
  try {
    // 1. Fetch application with relation records
    let application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        student: { select: { id: true, name: true, email: true } },
        scholarship: true,
        documents: true
      }
    });

    if (!application) {
      console.error(`[WORKFLOW ERROR] Application ${applicationId} not found`);
      return;
    }

    // Clear any previous agent results for clean replay
    await prisma.agentResult.deleteMany({
      where: { applicationId }
    });

    // ==========================================
    // STAGE 1: DOCUMENT VERIFICATION
    // ==========================================
    console.log(`[STAGE] DOCUMENT_VERIFICATION for application ${applicationId}`);
    await updateStage(applicationId, 'DOCUMENT_VERIFICATION');

    let allDocsValid = true;
    const verifiedDocsSummary = [];

    for (const doc of application.documents) {
      const verifyResult = await documentAgent.verifyDocument(doc, application);
      
      // Update individual document record
      await prisma.document.update({
        where: { id: doc.id },
        data: {
          status: verifyResult.status,
          confidence: verifyResult.confidence,
          errorMessage: verifyResult.errorMessage,
          extractedText: verifyResult.extractedText,
          metadata: verifyResult.metadata
        }
      });

      verifiedDocsSummary.push({
        type: doc.documentType,
        status: verifyResult.status,
        confidence: verifyResult.confidence,
        error: verifyResult.errorMessage
      });

      if (verifyResult.status !== 'VERIFIED') {
        allDocsValid = false;
      }
    }

    // Save DOCUMENT agent summary result
    await prisma.agentResult.create({
      data: {
        applicationId,
        agentType: 'DOCUMENT',
        status: allDocsValid ? 'SUCCESS' : 'FAILED',
        confidence: allDocsValid ? 0.95 : 0.85,
        resultData: JSON.stringify({ verifiedDocsSummary, allDocsValid })
      }
    });

    await prisma.auditLog.create({
      data: {
        applicationId,
        actorType: 'SYSTEM',
        action: 'AGENT_DOCUMENT_VERIFICATION_COMPLETE',
        details: `Verified ${application.documents.length} documents. All verified successfully: ${allDocsValid}`
      }
    });

    // BUG-003 FIX: If every document was rejected, halt the pipeline and notify the student.
    // There is no point in running eligibility or fraud checks against invalid documents.
    const anyDocVerified = verifiedDocsSummary.some(d => d.status === 'VERIFIED');
    if (!anyDocVerified && application.documents.length > 0) {
      await prisma.application.update({
        where: { id: applicationId },
        data: { status: 'DRAFT', currentStage: 'DRAFT' }
      });

      await prisma.auditLog.create({
        data: {
          applicationId,
          actorType: 'SYSTEM',
          action: 'WORKFLOW_HALTED_ALL_DOCS_REJECTED',
          details: 'Pipeline halted: all uploaded documents failed verification. Application returned to DRAFT for re-submission.'
        }
      });

      await notificationAgent.sendNotification(
        application.studentId,
        applicationId,
        'Action Required: Document Verification Failed',
        'All your uploaded documents failed AI verification. Please re-upload valid, clear, and authentic documents. Your application has been returned to Draft status.'
      );

      console.log(`[WORKFLOW HALTED] All docs rejected for application ${applicationId}. Returned to DRAFT.`);
      return;
    }

    // ==========================================
    // STAGE 2: ELIGIBILITY CHECK
    // ==========================================
    console.log(`[STAGE] ELIGIBILITY_CHECK for application ${applicationId}`);
    await updateStage(applicationId, 'ELIGIBILITY_CHECK');

    // Re-fetch application to load document OCR data if needed
    application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        student: { select: { id: true, name: true, email: true } },
        scholarship: true,
        documents: true,
        agentResults: true
      }
    });

    const eligibilityResult = await eligibilityAgent.checkEligibility(application, application.scholarship);
    
    await prisma.agentResult.create({
      data: {
        applicationId,
        agentType: 'ELIGIBILITY',
        status: eligibilityResult.status,
        confidence: eligibilityResult.confidence,
        resultData: eligibilityResult.resultData
      }
    });

    await prisma.auditLog.create({
      data: {
        applicationId,
        actorType: 'SYSTEM',
        action: 'AGENT_ELIGIBILITY_CHECK_COMPLETE',
        details: `Eligibility determination: ${eligibilityResult.status}`
      }
    });

    // ==========================================
    // STAGE 3: FRAUD DETECTION
    // ==========================================
    console.log(`[STAGE] FRAUD_DETECTION for application ${applicationId}`);
    await updateStage(applicationId, 'FRAUD_DETECTION');

    const fraudResult = await fraudAgent.detectFraud(application);

    await prisma.agentResult.create({
      data: {
        applicationId,
        agentType: 'FRAUD',
        status: fraudResult.status,
        confidence: fraudResult.confidence,
        resultData: fraudResult.resultData
      }
    });

    await prisma.auditLog.create({
      data: {
        applicationId,
        actorType: 'SYSTEM',
        action: 'AGENT_FRAUD_SWEEP_COMPLETE',
        details: `Fraud sweep evaluation: ${fraudResult.status} with risk summary.`
      }
    });

    // ==========================================
    // STAGE 4: OFFICER COPILOT & TRANSITION
    // ==========================================
    console.log(`[STAGE] OFFICER_REVIEW for application ${applicationId}`);
    
    // Load full application state including all results to feed officer copilot
    const fullyAnalyzedApp = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        student: { select: { id: true, name: true, email: true } },
        scholarship: true,
        documents: true,
        agentResults: true
      }
    });

    const copilotResult = await officerAgent.generateOfficerSummary(fullyAnalyzedApp);

    await prisma.agentResult.create({
      data: {
        applicationId,
        agentType: 'COPILOT',
        status: copilotResult.status,
        confidence: copilotResult.confidence,
        resultData: copilotResult.resultData
      }
    });

    // Update application state to OFFICER_REVIEW
    await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: 'OFFICER_REVIEW',
        currentStage: 'OFFICER_REVIEW'
      }
    });

    // Write final automated audit trace
    await prisma.auditLog.create({
      data: {
        applicationId,
        actorType: 'SYSTEM',
        action: 'APPLICATION_PENDING_OFFICER_REVIEW',
        details: 'All automated AI assessments completed. Application queued for officer verification.'
      }
    });

    // Send notifications to Student
    const hasWarnings = docVerifyResultFailed(fullyAnalyzedApp) || eligibilityResult.status === 'FAILED' || fraudResult.status !== 'SUCCESS';
    
    let notificationTitle = 'Application Under Officer Review';
    let notificationMsg = 'Your application has successfully passed preliminary automated verifications and is now under officer review.';
    
    if (hasWarnings) {
      notificationTitle = 'Application Flagged for Verification';
      notificationMsg = 'AI preliminary verification flagged items requiring officer clarification. Your application is queued for manual check.';
    }

    await notificationAgent.sendNotification(
      application.studentId,
      applicationId,
      notificationTitle,
      notificationMsg
    );

    console.log(`[WORKFLOW COMPLETE] Finished processing application ${applicationId}`);

  } catch (error) {
    console.error(`[WORKFLOW CRITICAL EXCEPTION] Processing application ${applicationId} failed:`, error);

    try {
      // BUG-010 FIX: Mark the application with a WORKFLOW_FAILED status so officers
      // know it is stuck and can use the retry-workflow endpoint to recover it.
      await prisma.application.update({
        where: { id: applicationId },
        data: { status: 'WORKFLOW_FAILED', currentStage: 'WORKFLOW_FAILED' }
      }).catch(() => {}); // Ignore if application was already deleted

      await prisma.auditLog.create({
        data: {
          applicationId,
          actorType: 'SYSTEM',
          action: 'WORKFLOW_CRITICAL_FAILURE',
          details: `Error: ${error.message}`
        }
      });
    } catch (dbError) {
      console.error('Failed to log workflow error to DB:', dbError);
    }
  }
};

/**
 * Helper to update stage status in database and log transition
 */
const updateStage = async (applicationId, stage) => {
  await prisma.application.update({
    where: { id: applicationId },
    data: { currentStage: stage }
  });

  await prisma.auditLog.create({
    data: {
      applicationId,
      actorType: 'SYSTEM',
      action: 'STAGE_TRANSITION',
      details: `Moved to workflow stage: ${stage}`
    }
  });
};

/**
 * Helper to check if any document was rejected
 */
const docVerifyResultFailed = (app) => {
  return app.documents.some(d => d.status !== 'VERIFIED');
};

module.exports = {
  processApplication
};
