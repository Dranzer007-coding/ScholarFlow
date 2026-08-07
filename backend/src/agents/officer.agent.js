const aiService = require('../services/ai.service');

/**
 * Generate a summary copilot analysis for the reviewing officer.
 * 
 * @param {object} application Application with documents, and agent results.
 * @returns {Promise<object>} Copilot result.
 */
const generateOfficerSummary = async (application) => {
  const { student, scholarship, cgpa, annualIncome, category, course, college } = application;
  
  // Extract statuses from other agents
  const docVerifyResult = application.agentResults?.find(r => r.agentType === 'DOCUMENT');
  const eligibilityResult = application.agentResults?.find(r => r.agentType === 'ELIGIBILITY');
  const fraudResult = application.agentResults?.find(r => r.agentType === 'FRAUD');

  const docStatus = docVerifyResult ? docVerifyResult.status : 'PENDING';
  const eligStatus = eligibilityResult ? eligibilityResult.status : 'PENDING';
  const fraudStatus = fraudResult ? fraudResult.status : 'PENDING';

  // 1. Try to use Gemini if configured to synthesize the report
  if (aiService.isApiConfigured()) {
    const systemPrompt = `You are the Officer Copilot Agent for ScholarFlow AI.
Synthesize the application details, document checks, eligibility, and fraud audit.
Prepare a dashboard review report.
Return a JSON object:
{
  "summary": string,
  "recommendation": "APPROVE" | "REJECT" | "REQUEST_REVISION",
  "reasoning": string,
  "flags": string[],
  "confidence": float (0.0 to 1.0)
}`;

    const userPrompt = `Applicant Profile:
Name: ${student?.name || 'Unknown'}
College: ${college}
Course: ${course}
CGPA: ${cgpa}
Annual Income: Rs. ${annualIncome}
Category: ${category}
Scholarship Applied: ${scholarship?.title}

Agent Verification Results:
Document Verification Status: ${docStatus} (Details: ${docVerifyResult?.resultData || 'None'})
Eligibility Check Status: ${eligStatus} (Details: ${eligStatus === 'FAILED' ? 'Failed criteria match' : 'Passed criteria match'})
Fraud Detection Status: ${fraudStatus} (Details: ${fraudResult?.resultData || 'None'})

Generate review summary and recommendation.`;

    const result = await aiService.generateJSON(userPrompt, systemPrompt);
    if (result) {
      return {
        status: 'SUCCESS',
        confidence: result.confidence || 0.95,
        resultData: JSON.stringify({
          summary: result.summary,
          recommendation: result.recommendation,
          reasoning: result.reasoning,
          flags: result.flags || []
        })
      };
    }
  }

  // 2. Fallback Rule-Based Synthesis
  let recommendation = 'APPROVE';
  let reasoning = 'All automatic checks (document validity, rules eligibility, and fraud sweep) returned clean results. The application complies with all guidelines.';
  const flags = [];

  if (docStatus === 'FAILED') {
    recommendation = 'REQUEST_REVISION';
    flags.push('Document verification failed. One or more documents are unreadable or mismatched.');
  }

  if (eligStatus === 'FAILED') {
    recommendation = 'REJECT';
    flags.push('Rule eligibility failed. Student does not meet academic or financial criteria.');
  }

  if (fraudStatus === 'FAILED') {
    recommendation = 'REJECT';
    flags.push('CRITICAL: High fraud risk score. Duplicate Aadhaar or bank account identifiers found.');
  } else if (fraudStatus === 'WARNING') {
    if (recommendation === 'APPROVE') recommendation = 'REQUEST_REVISION';
    flags.push('MODERATE RISK: Shared bank account details or multiple active applications.');
  }

  if (flags.length > 0) {
    reasoning = `Review recommended. AI flagged the following operational concerns: ${flags.join('; ')}`;
  }

  const summaryText = `Applicant ${student?.name || 'Student'} is applying for ${scholarship?.title || 'Scholarship'}. Academic score is ${cgpa} CGPA and annual family income is Rs. ${annualIncome}. Main checks: Documents (${docStatus}), Eligibility (${eligStatus}), Fraud Risk (${fraudStatus}).`;

  const copilotData = {
    summary: summaryText,
    recommendation,
    reasoning,
    flags
  };

  return {
    status: recommendation === 'APPROVE' ? 'SUCCESS' : 'WARNING',
    confidence: 0.9,
    resultData: JSON.stringify(copilotData)
  };
};

module.exports = {
  generateOfficerSummary
};
