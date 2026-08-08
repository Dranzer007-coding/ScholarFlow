const prisma = require('../config/database');
const notificationAgent = require('../agents/notification.agent');

// @desc    Get officer review dashboard metrics and application queue
// @route   GET /api/officer/applications
// @access  Private/Officer
const getOfficerDashboard = async (req, res, next) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // 1. Fetch KPI Statistics
    const totalPending = await prisma.application.count({
      where: { status: 'OFFICER_REVIEW' }
    });

    const approvedToday = await prisma.application.count({
      where: {
        status: 'APPROVED',
        updatedAt: { gte: startOfToday }
      }
    });

    const totalReviewedToday = await prisma.application.count({
      where: {
        status: { in: ['APPROVED', 'REJECTED'] },
        updatedAt: { gte: startOfToday }
      }
    });

    // Flagged cases: applications with WARNING or FAILED status in any agentResult
    const flaggedApplicationsCount = await prisma.application.count({
      where: {
        status: 'OFFICER_REVIEW',
        agentResults: {
          some: {
            agentType: { in: ['FRAUD', 'DOCUMENT', 'ELIGIBILITY'] },
            status: { in: ['FAILED', 'WARNING'] }
          }
        }
      }
    });

    // 2. Fetch the actual queue of applications under review
    const applications = await prisma.application.findMany({
      where: {
        status: { in: ['OFFICER_REVIEW', 'APPROVED', 'REJECTED'] }
      },
      include: {
        student: { select: { name: true, email: true } },
        scholarship: { select: { title: true, amount: true } },
        agentResults: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Format agentResults for frontend ease
    const formattedApplications = applications.map(app => {
      const parsedResults = app.agentResults.map(r => {
        let parsedData;
        try {
          parsedData = JSON.parse(r.resultData);
        } catch {
          parsedData = { parseError: true };
        }
        return { ...r, resultData: parsedData };
      });

      // Find copilot and fraud summary
      const copilot = parsedResults.find(r => r.agentType === 'COPILOT');
      const fraud = parsedResults.find(r => r.agentType === 'FRAUD');

      return {
        id: app.id,
        studentName: app.student.name,
        scholarshipTitle: app.scholarship.title,
        amount: app.scholarship.amount,
        status: app.status,
        currentStage: app.currentStage,
        cgpa: app.cgpa,
        annualIncome: app.annualIncome,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
        aiRecommendation: copilot ? copilot.resultData.recommendation : 'PENDING',
        aiReasoning: copilot ? copilot.resultData.reasoning : '',
        fraudRiskScore: fraud ? fraud.resultData.riskScore : 0.0,
        fraudSummary: fraud ? fraud.resultData.summary : ''
      };
    });

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalPending,
          todayReviews: totalReviewedToday,
          flaggedCases: flaggedApplicationsCount,
          approvedToday
        },
        applications: formattedApplications
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process officer action on application (Approve, Reject, Request Revision)
// @route   POST /api/officer/applications/:id/action
// @access  Private/Officer
const takeOfficerAction = async (req, res, next) => {
  try {
    const { action, comments } = req.body;
    const applicationId = req.params.id;

    if (!action || !['APPROVE', 'REJECT', 'REQUEST_REVISION'].includes(action)) {
      return res.status(400).json({ success: false, error: 'Please provide a valid action (APPROVE, REJECT, REQUEST_REVISION)' });
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId }
    });

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    if (application.status !== 'OFFICER_REVIEW') {
      return res.status(400).json({ success: false, error: 'Application is not currently in officer review stage' });
    }

    let nextStatus;
    let notificationTitle;
    let notificationMessage;

    if (action === 'APPROVE') {
      nextStatus = 'APPROVED';
      notificationTitle = 'Scholarship Approved 🎉';
      notificationMessage = `Congratulations! Your scholarship application has been approved. Comments: ${comments || 'Meets criteria.'}`;
    } else if (action === 'REJECT') {
      nextStatus = 'REJECTED';
      notificationTitle = 'Scholarship Application Update';
      notificationMessage = `Your scholarship application has been rejected. Reason: ${comments || 'Criteria mismatch.'}`;
    } else {
      nextStatus = 'DRAFT'; // Sends it back to draft for user revision
      notificationTitle = 'Information Requested for Application';
      notificationMessage = `Officer requested information / updates on your documents. Officer comment: "${comments || 'Please re-upload marksheet'}". Your application is unlocked for revision.`;
    }

    // Update application
    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: nextStatus,
        currentStage: action === 'REQUEST_REVISION' ? 'DRAFT' : 'COMPLETED'
      }
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        applicationId,
        userId: req.user.id,
        actorType: 'OFFICER',
        action: `OFFICER_${action}`,
        details: `Officer reviewed and set status to ${nextStatus}. Officer comments: ${comments || 'No comment'}`
      }
    });

    // Send notifications to Student
    await notificationAgent.sendNotification(
      application.studentId,
      applicationId,
      notificationTitle,
      notificationMessage
    );

    res.status(200).json({
      success: true,
      message: `Application successfully updated to ${nextStatus}`,
      data: updatedApplication
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Officer Copilot Evidence-Based Q&A Chat
// @route   POST /api/officer/applications/:id/copilot-chat
// @access  Private/Officer
const queryOfficerCopilot = async (req, res, next) => {
  try {
    const officerAgent = require('../agents/officer.agent');
    const { question } = req.body;
    const applicationId = req.params.id;

    if (!question || !question.trim()) {
      return res.status(400).json({ success: false, error: 'Please provide a valid question for the Officer Copilot.' });
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        student: { select: { id: true, name: true, email: true } },
        scholarship: true,
        documents: true,
        agentResults: true,
        auditLogs: { orderBy: { timestamp: 'desc' }, take: 10 }
      }
    });

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    const copilotAnswer = await officerAgent.answerOfficerQuery(application, question.trim());

    // Create Audit Log of Q&A interaction for manual compliance traceability
    await prisma.auditLog.create({
      data: {
        applicationId,
        userId: req.user.id,
        actorType: 'OFFICER',
        action: 'COPILOT_QA_QUERY',
        details: `Officer asked Copilot: "${question.trim().substring(0, 100)}" -> Recommendation: ${copilotAnswer.recommendation}`
      }
    });

    res.status(200).json({
      success: true,
      data: copilotAnswer
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOfficerDashboard,
  takeOfficerAction,
  queryOfficerCopilot
};
