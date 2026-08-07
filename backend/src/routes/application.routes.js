const express = require('express');
const router = express.Router();
const {
  createApplicationDraft,
  getStudentApplications,
  getApplicationById,
  submitApplication,
  uploadDocument,
  cancelApplicationDraft,
  retryWorkflow
} = require('../controllers/application.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { upload, validateMagicBytes } = require('../middleware/upload.middleware');

router.post('/', protect, authorize('STUDENT'), createApplicationDraft);
router.get('/student', protect, authorize('STUDENT'), getStudentApplications);
router.get('/:id', protect, getApplicationById); // Student or Officer can view details
router.post('/:id/submit', protect, authorize('STUDENT'), submitApplication);
router.post('/:id/documents', protect, authorize('STUDENT'), upload.single('file'), validateMagicBytes, uploadDocument);
router.delete('/:id', protect, authorize('STUDENT'), cancelApplicationDraft);
router.post('/:id/retry-workflow', protect, authorize('OFFICER'), retryWorkflow);

module.exports = router;
