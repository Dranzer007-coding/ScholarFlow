const prisma = require('../config/database');
const aiService = require('../services/ai.service');

/**
 * Perform fraud risk analysis on the application by scanning for duplicate fields.
 * 
 * @param {object} application Parent application details
 * @returns {Promise<object>} Result containing risk status, confidence, and details.
 */
const detectFraud = async (application) => {
  const { id, studentId, aadhaarNumber, bankAccountNumber } = application;

  // Query database for matching Aadhaar or Bank Accounts in OTHER applications
  const duplicateAadhaarApps = await prisma.application.findMany({
    where: {
      id: { not: id },
      aadhaarNumber: aadhaarNumber,
      status: { notIn: ['REJECTED'] }
    },
    include: { student: { select: { name: true, email: true } } }
  });

  const duplicateBankApps = await prisma.application.findMany({
    where: {
      id: { not: id },
      bankAccountNumber: bankAccountNumber,
      status: { notIn: ['REJECTED'] }
    },
    include: { student: { select: { name: true, email: true } } }
  });

  const studentOtherApps = await prisma.application.findMany({
    where: {
      id: { not: id },
      studentId: studentId,
      status: { notIn: ['REJECTED'] }
    }
  });

  const duplicateAadhaarFound = duplicateAadhaarApps.length > 0;
  const duplicateBankFound = duplicateBankApps.length > 0;
  const multipleAppsFound = studentOtherApps.length > 0;

  // Compute risk score based on severity of duplicate markers
  // Aadhaar duplicate is the strongest identity theft signal: 0.6 alone triggers FAILED (>= 0.6 threshold)
  // Bank duplicate alone: 0.4 (WARNING); combined with multi-apps: 0.5 (still WARNING — officer decides)
  // Aadhaar + Bank: 1.0 (FAILED), Aadhaar + multi-apps: 0.7 (FAILED)
  let riskScore = 0.0;
  let status = 'SUCCESS';

  if (duplicateAadhaarFound) riskScore += 0.6;
  if (duplicateBankFound) riskScore += 0.4;
  if (multipleAppsFound) riskScore += 0.1;

  riskScore = Math.min(riskScore, 1.0);

  if (riskScore >= 0.6) {
    status = 'FAILED'; // High risk — per AGENTS.md spec
  } else if (riskScore > 0.0) {
    status = 'WARNING'; // Medium risk
  }

  // 1. Try to use Gemini if configured to summarize the fraud flags
  if (aiService.isApiConfigured()) {
    const systemPrompt = `You are the Fraud Detection Agent for ScholarFlow AI.
Given duplicate scans, summarize the findings and produce a risk assessment report.
Return a JSON object:
{
  "summary": string,
  "recommendation": string,
  "confidence": float (0.0 to 1.0)
}`;

    const userPrompt = `Analysis metrics:
Risk Score: ${riskScore}
Duplicate Aadhaar Found: ${duplicateAadhaarFound} (Details: ${JSON.stringify(duplicateAadhaarApps.map(a => ({ name: a.student.name, appId: a.id })))})
Duplicate Bank Account Found: ${duplicateBankFound} (Details: ${JSON.stringify(duplicateBankApps.map(a => ({ name: a.student.name, appId: a.id })))})
Other Active Applications by Student: ${studentOtherApps.length}

Please summarize this risk audit.`;

    const result = await aiService.generateJSON(userPrompt, systemPrompt);
    if (result) {
      const reasoning = {
        riskScore,
        duplicateAadhaar: duplicateAadhaarFound,
        duplicateBank: duplicateBankFound,
        multipleApplications: studentOtherApps.length,
        summary: result.summary,
        recommendation: result.recommendation
      };

      return {
        status,
        confidence: result.confidence || 0.95,
        resultData: JSON.stringify(reasoning)
      };
    }
  }

  // 2. Fallback Rule-Based Text Generation
  let summary = 'No duplicate identity markers (Aadhaar or Bank details) were identified. Low fraud profile.';
  let recommendation = 'Proceed with regular processing.';

  if (duplicateAadhaarFound && duplicateBankFound) {
    summary = `CRITICAL: Duplicate Aadhaar AND Bank details found in other active applications. Identified matches associated with ${duplicateAadhaarApps.map(a => a.student.name).join(', ')}.`;
    recommendation = 'IMMEDIATE REJECTION recommended. Flag for administrative audit.';
  } else if (duplicateAadhaarFound) {
    summary = `WARNING: Aadhaar number matches another submitted application. Matches found: ${duplicateAadhaarApps.map(a => a.student.name).join(', ')}.`;
    recommendation = 'Hold application. Request identity validation verification.';
  } else if (duplicateBankFound) {
    summary = `WARNING: Bank account matches another application submitted under a different identity. Matches found: ${duplicateBankApps.map(a => a.student.name).join(', ')}.`;
    recommendation = 'Officer check recommended to verify bank account ownership credentials.';
  } else if (multipleAppsFound) {
    summary = `Student has ${studentOtherApps.length} other active scholarship application(s).`;
    recommendation = 'Verify double-dipping rules for active scholarships.';
  }

  const reasoning = {
    riskScore,
    duplicateAadhaar: duplicateAadhaarFound,
    duplicateBank: duplicateBankFound,
    multipleApplications: studentOtherApps.length,
    summary,
    recommendation
  };

  return {
    status,
    confidence: 1.0,
    resultData: JSON.stringify(reasoning)
  };
};

module.exports = {
  detectFraud
};
