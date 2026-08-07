const express = require('express');
const router = express.Router();
const { getOfficerDashboard, takeOfficerAction } = require('../controllers/officer.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/applications', protect, authorize('OFFICER'), getOfficerDashboard);
router.post('/applications/:id/action', protect, authorize('OFFICER'), takeOfficerAction);

module.exports = router;
