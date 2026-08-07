const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

const logHeader = (title) => {
  console.log(`\n==================================================`);
  console.log(` ${title.toUpperCase()}`);
  console.log(`==================================================`);
};

async function runVerification() {
  console.log('Starting ScholarFlow AI End-to-End Workflow Verification...');

  // 1. Log in student
  logHeader('Step 1: Student Login');
  const studentLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'rahul@student.com', password: 'password123' })
  });
  const studentLoginJson = await studentLoginRes.json();
  if (!studentLoginJson.success) throw new Error('Student login failed: ' + JSON.stringify(studentLoginJson));
  const studentToken = studentLoginJson.data.token;
  console.log(`Logged in as student. Token: ${studentToken.substring(0, 20)}...`);

  // 2. Fetch the draft application ID seeded in DB
  logHeader('Step 2: Retrieve seeded draft application');
  const studentAppsRes = await fetch(`${BASE_URL}/applications/student`, {
    headers: { 'Authorization': `Bearer ${studentToken}` }
  });
  const studentAppsJson = await studentAppsRes.json();
  if (!studentAppsJson.success || studentAppsJson.data.length === 0) {
    throw new Error('No applications found for student');
  }
  const application = studentAppsJson.data[0];
  const appId = application.id;
  console.log(`Found draft application ID: ${appId} for scholarship: ${application.scholarship.title}`);

  // 3. Create dummy file uploads and upload documents
  logHeader('Step 3: Upload Required Documents');
  const docs = ['AADHAAR', 'INCOME_CERTIFICATE', 'MARKSHEET'];
  
  for (const docType of docs) {
    const dummyFilename = `dummy_${docType.toLowerCase()}.pdf`;
    const dummyPath = path.join(__dirname, dummyFilename);
    fs.writeFileSync(dummyPath, `Dummy contents for ${docType} verification`);
    
    // Create multipart payload
    const formData = new FormData();
    formData.append('documentType', docType);
    
    const fileBuffer = fs.readFileSync(dummyPath);
    const blob = new Blob([fileBuffer], { type: 'application/pdf' });
    formData.append('file', blob, dummyFilename);

    console.log(`Uploading ${docType}...`);
    const uploadRes = await fetch(`${BASE_URL}/applications/${appId}/documents`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${studentToken}` },
      body: formData
    });
    
    const uploadJson = await uploadRes.json();
    if (!uploadJson.success) {
      throw new Error(`Upload failed for ${docType}: ` + JSON.stringify(uploadJson));
    }
    console.log(`Uploaded successfully. Status: ${uploadJson.data.status}`);
    
    // Clean up local temp file
    fs.unlinkSync(dummyPath);
  }

  // 4. Submit application to lock it and trigger AI Orchestration
  logHeader('Step 4: Submit Application (Trigger AI Orchestration)');
  const submitRes = await fetch(`${BASE_URL}/applications/${appId}/submit`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${studentToken}` }
  });
  const submitJson = await submitRes.json();
  if (!submitJson.success) throw new Error('Submission failed: ' + JSON.stringify(submitJson));
  console.log(`Application submitted. Message: "${submitJson.message}"`);

  // Wait 2.5 seconds for AI agents background execution to complete
  console.log('\nWaiting for AI agents workflow engine to complete processing...');
  await new Promise(resolve => setTimeout(resolve, 2500));

  // 5. Fetch application details as student to verify AI agent results
  logHeader('Step 5: Verify AI Agent Decisions');
  const appDetailsRes = await fetch(`${BASE_URL}/applications/${appId}`, {
    headers: { 'Authorization': `Bearer ${studentToken}` }
  });
  const appDetailsJson = await appDetailsRes.json();
  if (!appDetailsJson.success) throw new Error('Failed to fetch details: ' + JSON.stringify(appDetailsJson));
  
  const appDetails = appDetailsJson.data;
  console.log(`Application status: ${appDetails.status}`);
  console.log(`Current workflow stage: ${appDetails.currentStage}`);
  
  console.log('\nAI Agent Outputs:');
  appDetails.agentResults.forEach(r => {
    console.log(`- Agent [${r.agentType}]: Status = ${r.status}, Confidence = ${r.confidence * 100}%`);
    if (r.agentType === 'COPILOT') {
      console.log(`  Copilot Recommendation: ${r.resultData.recommendation}`);
      console.log(`  Copilot Summary: "${r.resultData.summary}"`);
    } else if (r.agentType === 'FRAUD') {
      console.log(`  Fraud Risk Score: ${r.resultData.riskScore}`);
      console.log(`  Fraud Summary: "${r.resultData.summary}"`);
    }
  });

  // 6. Log in Officer
  logHeader('Step 6: Officer Login');
  const officerLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'scholarflow_off@gmail.com', password: 'scholar1234' })
  });
  const officerLoginJson = await officerLoginRes.json();
  if (!officerLoginJson.success) throw new Error('Officer login failed: ' + JSON.stringify(officerLoginJson));
  const officerToken = officerLoginJson.data.token;
  console.log(`Logged in as Officer. Token: ${officerToken.substring(0, 20)}...`);

  // 7. Get Officer Dashboard stats & queue
  logHeader('Step 7: Officer Dashboard Audit');
  const dashboardRes = await fetch(`${BASE_URL}/officer/applications`, {
    headers: { 'Authorization': `Bearer ${officerToken}` }
  });
  const dashboardJson = await dashboardRes.json();
  if (!dashboardJson.success) throw new Error('Failed to fetch officer dashboard');
  
  const stats = dashboardJson.data.stats;
  console.log(`Dashboard KPI stats:`);
  console.log(`- Pending Review queue count: ${stats.totalPending}`);
  console.log(`- Flagged cases count: ${stats.flaggedCases}`);
  console.log(`- Approved today: ${stats.approvedToday}`);

  // 8. Officer takes approval action
  logHeader('Step 8: Officer Approval Action');
  const actionRes = await fetch(`${BASE_URL}/officer/applications/${appId}/action`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${officerToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'APPROVE',
      comments: 'All documents verified. Matches income bounds. Verified manually by Officer Aachal Gupta.'
    })
  });
  const actionJson = await actionRes.json();
  if (!actionJson.success) throw new Error('Officer approval failed: ' + JSON.stringify(actionJson));
  console.log(`Approval action success. Message: "${actionJson.message}"`);

  // 9. Fetch audit logs (timeline) to verify traceability
  logHeader('Step 9: Audit Timeline (Traceability check)');
  const finalAppRes = await fetch(`${BASE_URL}/applications/${appId}`, {
    headers: { 'Authorization': `Bearer ${studentToken}` }
  });
  const finalAppJson = await finalAppRes.json();
  const finalApp = finalAppJson.data;
  console.log(`Final application status: ${finalApp.status}`);
  console.log('\nChronological Audit Timeline:');
  finalApp.auditLogs.forEach(log => {
    const time = new Date(log.timestamp).toLocaleTimeString();
    console.log(`[${time}] Actor: ${log.actorType} | Action: ${log.action} | Details: ${log.details}`);
  });

  console.log('\n==================================================');
  console.log(' END-TO-END FLOW VERIFICATION PASSED SUCCESSFULLY!');
  console.log('==================================================');
}

runVerification().catch(err => {
  console.error('\nVerification failed:', err);
  process.exit(1);
});
