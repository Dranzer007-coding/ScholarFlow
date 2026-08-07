const aiService = require('../services/ai.service');

/**
 * Assess application eligibility against scholarship rules.
 * 
 * @param {object} application Detailed application
 * @param {object} scholarship Scholarship details
 * @returns {Promise<object>} Result containing status, confidence, and reasoning data.
 */
const checkEligibility = async (application, scholarship) => {
  // 1. Try to use Gemini if configured
  if (aiService.isApiConfigured()) {
    const systemPrompt = `You are the Eligibility Agent for ScholarFlow AI.
Analyze the application details against the scholarship criteria.
Determine whether the application is eligible.
Return a JSON object:
{
  "isEligible": boolean,
  "confidence": float (0.0 to 1.0),
  "reasoning": {
    "cgpa": { "status": "PASS" | "FAIL", "extracted": float, "required": float, "message": string },
    "income": { "status": "PASS" | "FAIL", "extracted": float, "limit": float, "message": string },
    "category": { "status": "PASS" | "FAIL", "extracted": string, "required": string, "message": string },
    "summary": string
  }
}`;

    const userPrompt = `Scholarship Requirements:
Title: ${scholarship.title}
Minimum CGPA: ${scholarship.criteriaMinCgpa}
Maximum Annual Income: ${scholarship.criteriaMaxIncome}
Eligible Categories: ${scholarship.criteriaCategory}

Student Application Data:
Name: ${application.student?.name || 'Unknown'}
CGPA: ${application.cgpa}
Annual Income: ${application.annualIncome}
Category: ${application.category}`;

    const result = await aiService.generateJSON(userPrompt, systemPrompt);
    if (result) {
      return {
        status: result.isEligible ? 'SUCCESS' : 'FAILED',
        confidence: result.confidence || 0.98,
        resultData: JSON.stringify(result.reasoning || {})
      };
    }
  }

  // 2. Fallback Rule-Based Engine
  const studentCgpa = application.cgpa;
  const studentIncome = application.annualIncome;
  const studentCategory = application.category;

  const reqCgpa = scholarship.criteriaMinCgpa;
  const reqIncome = scholarship.criteriaMaxIncome;
  const reqCategory = scholarship.criteriaCategory;

  const cgpaPass = studentCgpa >= reqCgpa;
  const incomePass = studentIncome <= reqIncome;
  const categoryPass = reqCategory.toUpperCase() === 'ALL' || reqCategory.toLowerCase() === studentCategory.toLowerCase();

  const isEligible = cgpaPass && incomePass && categoryPass;

  const reasoning = {
    cgpa: {
      status: cgpaPass ? 'PASS' : 'FAIL',
      extracted: studentCgpa,
      required: reqCgpa,
      message: cgpaPass 
        ? `Student CGPA ${studentCgpa} meets the minimum requirement of ${reqCgpa}.`
        : `Student CGPA ${studentCgpa} is below the minimum requirement of ${reqCgpa}.`
    },
    income: {
      status: incomePass ? 'PASS' : 'FAIL',
      extracted: studentIncome,
      limit: reqIncome,
      message: incomePass
        ? `Family annual income Rs. ${studentIncome} is below the maximum limit of Rs. ${reqIncome}.`
        : `Family annual income Rs. ${studentIncome} exceeds the maximum limit of Rs. ${reqIncome}.`
    },
    category: {
      status: categoryPass ? 'PASS' : 'FAIL',
      extracted: studentCategory,
      required: reqCategory,
      message: categoryPass
        ? `Student category '${studentCategory}' is eligible for this scholarship (Criteria: ${reqCategory}).`
        : `Student category '${studentCategory}' is not eligible for this scholarship (Criteria: ${reqCategory}).`
    },
    summary: isEligible
      ? 'All core eligibility criteria (CGPA, Income, Category) are fully satisfied.'
      : `Application rejected due to failure in the following criteria: ${[!cgpaPass && 'CGPA', !incomePass && 'Annual Income', !categoryPass && 'Category'].filter(Boolean).join(', ')}.`
  };

  return {
    status: isEligible ? 'SUCCESS' : 'FAILED',
    confidence: 1.0,
    resultData: JSON.stringify(reasoning)
  };
};

module.exports = {
  checkEligibility
};
