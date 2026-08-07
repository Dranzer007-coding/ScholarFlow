const prisma = require('../config/database');

// @desc    Get all scholarships
// @route   GET /api/scholarships
// @access  Public
const getScholarships = async (req, res, next) => {
  try {
    const scholarships = await prisma.scholarship.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, data: scholarships });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single scholarship
// @route   GET /api/scholarships/:id
// @access  Public
const getScholarshipById = async (req, res, next) => {
  try {
    const scholarship = await prisma.scholarship.findUnique({
      where: { id: req.params.id }
    });

    if (!scholarship) {
      return res.status(404).json({ success: false, error: 'Scholarship not found' });
    }

    res.status(200).json({ success: true, data: scholarship });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new scholarship
// @route   POST /api/scholarships
// @access  Private/Officer
const createScholarship = async (req, res, next) => {
  try {
    const { title, description, criteriaMinCgpa, criteriaMaxIncome, criteriaCategory, amount } = req.body;

    if (!title || !description || criteriaMinCgpa === undefined || criteriaMaxIncome === undefined || !criteriaCategory || !amount) {
      return res.status(400).json({ success: false, error: 'Please provide all required fields' });
    }

    const scholarship = await prisma.scholarship.create({
      data: {
        title,
        description,
        criteriaMinCgpa: parseFloat(criteriaMinCgpa),
        criteriaMaxIncome: parseFloat(criteriaMaxIncome),
        criteriaCategory,
        amount: parseFloat(amount)
      }
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        actorType: 'OFFICER',
        action: 'SCHOLARSHIP_CREATED',
        details: `Scholarship '${title}' created with ID: ${scholarship.id}`
      }
    });

    res.status(201).json({ success: true, data: scholarship });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getScholarships,
  getScholarshipById,
  createScholarship
};
