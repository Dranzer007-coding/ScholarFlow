const documentAgent = require('../src/agents/document.agent');
const fs = require('fs');
const path = require('path');

describe('Document Verification Anomalies and Security Checks', () => {
  const application = {
    aadhaarNumber: '111122223333', // Valid Verhoeff
    annualIncome: 150000,
    cgpa: 8.5,
    course: 'B.Tech',
    college: 'KIIT',
    student: {
      name: 'Rahul Sharma'
    }
  };

  const uploadsDir = path.join(__dirname, '../uploads');

  // Create uploads directory if it doesn't exist
  beforeAll(() => {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
  });

  const testFileHelper = (filename, content = 'Test document body') => {
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, content);
    return `/uploads/${filename}`;
  };

  const cleanFileHelper = (filename) => {
    const filePath = path.join(uploadsDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  };

  test('Reject empty/blank file (0 bytes)', async () => {
    const fileUrl = testFileHelper('test_empty.pdf', '');
    const doc = { documentType: 'AADHAAR', fileUrl };
    const result = await documentAgent.verifyDocument(doc, application);
    expect(result.status).toBe('REJECTED');
    expect(result.errorMessage).toContain('empty (0 bytes)');
    cleanFileHelper('test_empty.pdf');
  });

  test('Reject non-document image (selfie)', async () => {
    const fileUrl = testFileHelper('student_selfie.jpg');
    const doc = { documentType: 'AADHAAR', fileUrl };
    const result = await documentAgent.verifyDocument(doc, application);
    expect(result.status).toBe('REJECTED');
    expect(result.errorMessage).toContain('Non-document image');
    cleanFileHelper('student_selfie.jpg');
  });

  test('Reject wrong document slot', async () => {
    const fileUrl = testFileHelper('student_marksheet.pdf');
    const doc = { documentType: 'AADHAAR', fileUrl };
    const result = await documentAgent.verifyDocument(doc, application);
    expect(result.status).toBe('REJECTED');
    expect(result.errorMessage).toContain('Wrong document category');
    cleanFileHelper('student_marksheet.pdf');
  });

  test('Reject blurred document', async () => {
    const fileUrl = testFileHelper('blurred_document.png');
    const doc = { documentType: 'AADHAAR', fileUrl };
    const result = await documentAgent.verifyDocument(doc, application);
    expect(result.status).toBe('REJECTED');
    expect(result.errorMessage).toContain('blurred or pixelated');
    cleanFileHelper('blurred_document.png');
  });

  test('Reject digital font overlays (forgery)', async () => {
    const fileUrl = testFileHelper('forged_font_overlay.pdf');
    const doc = { documentType: 'AADHAAR', fileUrl };
    const result = await documentAgent.verifyDocument(doc, application);
    expect(result.status).toBe('REJECTED');
    expect(result.errorMessage).toContain('Mismatched fonts');
    cleanFileHelper('forged_font_overlay.pdf');
  });

  test('Reject specimen/sample watermarks', async () => {
    const fileUrl = testFileHelper('watermark_sample.pdf');
    const doc = { documentType: 'AADHAAR', fileUrl };
    const result = await documentAgent.verifyDocument(doc, application);
    expect(result.status).toBe('REJECTED');
    expect(result.errorMessage).toContain('SAMPLE, SPECIMEN');
    cleanFileHelper('watermark_sample.pdf');
  });

  test('Reject invalid Aadhaar Verhoeff algorithm UID', async () => {
    const fileUrl = testFileHelper('normal_aadhaar.pdf');
    const doc = { documentType: 'AADHAAR', fileUrl };
    const appWithBadAadhaar = { ...application, aadhaarNumber: '111122223334' }; // Invalid Verhoeff
    const result = await documentAgent.verifyDocument(doc, appWithBadAadhaar);
    expect(result.status).toBe('REJECTED');
    expect(result.errorMessage).toContain('Verhoeff algorithm');
    cleanFileHelper('normal_aadhaar.pdf');
  });

  test('Accept valid Aadhaar Verhoeff algorithm UID', async () => {
    const fileUrl = testFileHelper('normal_aadhaar.pdf');
    const doc = { documentType: 'AADHAAR', fileUrl };
    const result = await documentAgent.verifyDocument(doc, application);
    expect(result.status).toBe('VERIFIED');
    cleanFileHelper('normal_aadhaar.pdf');
  });

  test('Reject expired income certificate', async () => {
    const fileUrl = testFileHelper('expired_income.pdf');
    const doc = { documentType: 'INCOME_CERTIFICATE', fileUrl };
    const result = await documentAgent.verifyDocument(doc, application);
    expect(result.status).toBe('REJECTED');
    expect(result.errorMessage).toContain('validity period has expired');
    cleanFileHelper('expired_income.pdf');
  });

  test('Reject marksheet with mismatched subject totals', async () => {
    const fileUrl = testFileHelper('mismatched_totals.pdf');
    const doc = { documentType: 'MARKSHEET', fileUrl };
    const result = await documentAgent.verifyDocument(doc, application);
    expect(result.status).toBe('REJECTED');
    expect(result.errorMessage).toContain('do not add up mathematically');
    cleanFileHelper('mismatched_totals.pdf');
  });
});
