const prisma = require('../config/database');
const workflowService = require('../services/workflow.service');
const fs = require('fs');
const path = require('path');

// @desc    Create draft application
// @route   POST /api/applications
// @access  Private/Student
const createApplicationDraft = async (req, res, next) => {
  try {
    const { scholarshipId, cgpa, annualIncome, category, course, college, bankAccountNumber, ifscCode, aadhaarNumber } = req.body;

    if (!scholarshipId || cgpa === undefined || annualIncome === undefined || !category || !course || !college || !bankAccountNumber || !ifscCode || !aadhaarNumber) {
      return res.status(400).json({ success: false, error: 'Please provide all required fields' });
    }

    // Check if scholarship exists
    const scholarship = await prisma.scholarship.findUnique({ where: { id: scholarshipId } });
    if (!scholarship) {
      return res.status(404).json({ success: false, error: 'Scholarship not found' });
    }

    // Check if active application already exists for this student and scholarship
    const existing = await prisma.application.findFirst({
      where: {
        studentId: req.user.id,
        scholarshipId: scholarshipId,
        status: { notIn: ['REJECTED'] }
      }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'You already have an active application for this scholarship'
      });
    }

    const application = await prisma.application.create({
      data: {
        studentId: req.user.id,
        scholarshipId,
        status: 'DRAFT',
        currentStage: 'DRAFT',
        cgpa: parseFloat(cgpa),
        annualIncome: parseFloat(annualIncome),
        category,
        course,
        college,
        bankAccountNumber,
        ifscCode,
        aadhaarNumber
      }
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        applicationId: application.id,
        userId: req.user.id,
        actorType: 'USER',
        action: 'APPLICATION_DRAFT_CREATED',
        details: `Application draft created for scholarship: ${scholarship.title}`
      }
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student applications
// @route   GET /api/applications/student
// @access  Private/Student
const getStudentApplications = async (req, res, next) => {
  try {
    const applications = await prisma.application.findMany({
      where: { studentId: req.user.id },
      include: {
        scholarship: {
          select: { title: true, amount: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed application by ID
// @route   GET /api/applications/:id
// @access  Private
const getApplicationById = async (req, res, next) => {
  try {
    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: {
        student: {
          select: { name: true, email: true }
        },
        scholarship: true,
        documents: true,
        agentResults: true,
        auditLogs: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    // Access check: Only the student who submitted it, or an officer, can view it
    if (req.user.role === 'STUDENT' && application.studentId !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to view this application' });
    }

    // Parse JSON data for frontend convenience — wrapped in try/catch to survive malformed DB data
    const formattedAgentResults = application.agentResults.map(r => {
      let parsedData;
      try {
        parsedData = JSON.parse(r.resultData);
      } catch {
        parsedData = { parseError: true, raw: r.resultData };
      }
      return { ...r, resultData: parsedData };
    });

    const formattedApplication = {
      ...application,
      agentResults: formattedAgentResults
    };

    res.status(200).json({ success: true, data: formattedApplication });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit application (triggers workflow engine)
// @route   POST /api/applications/:id/submit
// @access  Private/Student
const submitApplication = async (req, res, next) => {
  try {
    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: { documents: true }
    });

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    if (application.studentId !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to modify this application' });
    }

    if (application.status !== 'DRAFT') {
      return res.status(400).json({ success: false, error: 'Application has already been submitted' });
    }

    // Check if required documents are uploaded
    const documentTypes = application.documents.map(d => d.documentType);
    const requiredTypes = ['AADHAAR', 'INCOME_CERTIFICATE', 'MARKSHEET'];
    const missing = requiredTypes.filter(type => !documentTypes.includes(type));

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required documents: ${missing.join(', ')}. Please upload them before submitting.`
      });
    }

    // Update application state to SUBMITTED
    const updatedApplication = await prisma.application.update({
      where: { id: application.id },
      data: {
        status: 'SUBMITTED',
        currentStage: 'SUBMITTED'
      }
    });

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        applicationId: application.id,
        userId: req.user.id,
        actorType: 'USER',
        action: 'APPLICATION_SUBMITTED',
        details: 'Application submitted successfully and workflow engine triggered.'
      }
    });

    // We trigger the workflow processing
    workflowService.processApplication(application.id).catch(err => {
      console.error(`Workflow processing error for application ${application.id}:`, err);
    });

    res.status(200).json({
      success: true,
      message: 'Application submitted successfully. AI workflow engine is processing.',
      data: updatedApplication
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload document for application
// @route   POST /api/applications/:id/documents
// @access  Private/Student
const uploadDocument = async (req, res, next) => {
  try {
    const { documentType } = req.body;
    const applicationId = req.params.id;

    if (!documentType || !req.file) {
      return res.status(400).json({ success: false, error: 'Please provide documentType and a file' });
    }

    if (!['AADHAAR', 'INCOME_CERTIFICATE', 'MARKSHEET'].includes(documentType)) {
      return res.status(400).json({ success: false, error: 'Invalid document type. Allowed: AADHAAR, INCOME_CERTIFICATE, MARKSHEET' });
    }

    // Check application
    const application = await prisma.application.findUnique({
      where: { id: applicationId }
    });

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    if (application.studentId !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to upload files for this application' });
    }

    if (!['DRAFT', 'OFFICER_REVIEW'].includes(application.status)) {
      return res.status(400).json({ success: false, error: 'Cannot upload files, application is already locked or submitted' });
    }

    // Check if document already exists
    const existingDoc = await prisma.document.findFirst({
      where: {
        applicationId,
        documentType
      }
    });

    let doc;
    const fileUrl = `/uploads/${req.file.filename}`;

    if (existingDoc) {
      // Delete old file from disk to prevent unbounded storage growth (BUG-006)
      const oldFilename = existingDoc.fileUrl.replace('/uploads/', '');
      const oldLocalPath = path.join(__dirname, '../../uploads', oldFilename);
      if (fs.existsSync(oldLocalPath)) {
        fs.unlink(oldLocalPath, (err) => {
          if (err) console.warn(`[UPLOAD] Failed to delete old file ${oldLocalPath}:`, err.message);
        });
      }

      // Update
      doc = await prisma.document.update({
        where: { id: existingDoc.id },
        data: {
          fileUrl,
          status: 'PENDING',
          confidence: null,
          errorMessage: null,
          extractedText: null,
          metadata: null
        }
      });
    } else {
      // Create
      doc = await prisma.document.create({
        data: {
          applicationId,
          documentType,
          fileUrl,
          status: 'PENDING'
        }
      });
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        applicationId,
        userId: req.user.id,
        actorType: 'USER',
        action: 'DOCUMENT_UPLOADED',
        details: `Uploaded ${documentType} file: ${req.file.originalname}`
      }
    });

    res.status(200).json({
      success: true,
      message: 'Document uploaded successfully',
      data: doc
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel (delete) an application in DRAFT status
// @route   DELETE /api/applications/:id
// @access  Private/Student
const cancelApplicationDraft = async (req, res, next) => {
  try {
    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: { documents: true }
    });

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    if (application.studentId !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to cancel this application' });
    }

    if (application.status !== 'DRAFT') {
      return res.status(400).json({ success: false, error: 'Only DRAFT applications can be cancelled' });
    }

    // Delete associated files from disk
    for (const doc of application.documents) {
      const filename = doc.fileUrl.replace('/uploads/', '');
      const localPath = path.join(__dirname, '../../uploads', filename);
      if (fs.existsSync(localPath)) {
        fs.unlink(localPath, (err) => {
          if (err) console.warn(`[CANCEL] Failed to delete file ${localPath}:`, err.message);
        });
      }
    }

    // Cascade delete handled by Prisma (Document, AgentResult, AuditLog cascade on Application)
    await prisma.application.delete({ where: { id: req.params.id } });

    res.status(200).json({ success: true, message: 'Application draft cancelled and deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Retry AI workflow for a stuck application
// @route   POST /api/applications/:id/retry-workflow
// @access  Private/Officer
const retryWorkflow = async (req, res, next) => {
  try {
    const application = await prisma.application.findUnique({
      where: { id: req.params.id }
    });

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    const retriableStatuses = ['SUBMITTED', 'DOCUMENT_VERIFICATION', 'ELIGIBILITY_CHECK', 'FRAUD_DETECTION', 'WORKFLOW_FAILED'];
    if (!retriableStatuses.includes(application.status)) {
      return res.status(400).json({
        success: false,
        error: `Cannot retry workflow for application in status '${application.status}'. Only stuck in-progress applications can be retried.`
      });
    }

    await prisma.auditLog.create({
      data: {
        applicationId: application.id,
        userId: req.user.id,
        actorType: 'OFFICER',
        action: 'WORKFLOW_RETRY_TRIGGERED',
        details: `Officer manually triggered workflow retry. Previous status: ${application.status}`
      }
    });

    // Reset to SUBMITTED so workflow can re-run cleanly
    await prisma.application.update({
      where: { id: application.id },
      data: { status: 'SUBMITTED', currentStage: 'SUBMITTED' }
    });

    workflowService.processApplication(application.id).catch(err => {
      console.error(`[RETRY] Workflow retry error for application ${application.id}:`, err);
    });

    res.status(200).json({ success: true, message: 'Workflow retry triggered successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createApplicationDraft,
  getStudentApplications,
  getApplicationById,
  submitApplication,
  uploadDocument,
  cancelApplicationDraft,
  retryWorkflow
};
