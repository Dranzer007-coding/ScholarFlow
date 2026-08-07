const express = require('express');
const router = express.Router();
const { getScholarships, getScholarshipById, createScholarship } = require('../controllers/scholarship.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', getScholarships);
router.get('/:id', getScholarshipById);
router.post('/', protect, authorize('OFFICER'), createScholarship);

module.exports = router;
