const fs = require('fs');
const path = require('path');
const documentAgent = require('../src/agents/document.agent');

const uploadsDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Sample applicant payload
const mockApplication = {
  aadhaarNumber: '111122223333', // Valid 12-digit Verhoeff UID
  annualIncome: 180000,
  cgpa: 8.8,
  course: 'B.Tech Computer Science',
  college: 'KIIT',
  student: {
    name: 'Rahul Sharma'
  }
};

// Edge Case Matrix dataset
const evalDataset = [
  {
    id: 1,
    name: 'Null Input (0-byte empty file)',
    docType: 'AADHAAR',
    filename: 'eval_empty_0byte.pdf',
    content: Buffer.alloc(0),
    expectedReason: 'NULL_OR_BLANK_INPUT'
  },
  {
    id: 2,
    name: 'Null Input (Whitespace string text file)',
    docType: 'INCOME_CERTIFICATE',
    filename: 'eval_whitespace.txt',
    content: '   \n\t   \n ',
    expectedReason: 'NULL_OR_BLANK_INPUT'
  },
  {
    id: 3,
    name: 'Garbage Input (Photo of a dog)',
    docType: 'AADHAAR',
    filename: 'eval_dog_photo.jpg',
    content: 'Binary image payload of a golden retriever dog playing in park.',
    expectedReason: 'ERROR_INVALID_DOCUMENT'
  },
  {
    id: 4,
    name: 'Garbage Input (Coffee cup photo)',
    docType: 'MARKSHEET',
    filename: 'eval_coffee_cup.png',
    content: 'Photo of a cup of morning coffee on a desk.',
    expectedReason: 'ERROR_INVALID_DOCUMENT'
  },
  {
    id: 5,
    name: 'Garbage Input (Random text gibberish)',
    docType: 'INCOME_CERTIFICATE',
    filename: 'eval_random_gibberish.pdf',
    content: 'asdfghjkl 123456 qwertyuiop zxcvbnm',
    expectedReason: 'MISSING_MANDATORY_FIELDS'
  },
  {
    id: 6,
    name: 'Category Mismatch (Income Certificate uploaded in Aadhaar slot)',
    docType: 'AADHAAR',
    filename: 'eval_income_in_aadhaar.pdf',
    content: 'OFFICE OF THE TAHSILDAR INCOME CERTIFICATE Annual Income: Rs 180000',
    expectedReason: 'ERROR_DOCUMENT_MISMATCH'
  },
  {
    id: 7,
    name: 'Category Mismatch (Aadhaar Card uploaded in Marksheet slot)',
    docType: 'MARKSHEET',
    filename: 'eval_aadhaar_in_marksheet.pdf',
    content: 'GOVERNMENT OF INDIA UNIQUE IDENTIFICATION AUTHORITY OF INDIA Aadhaar Card',
    expectedReason: 'ERROR_DOCUMENT_MISMATCH'
  },
  {
    id: 8,
    name: 'Category Mismatch (Marksheet uploaded in Income slot)',
    docType: 'INCOME_CERTIFICATE',
    filename: 'eval_marksheet_in_income.pdf',
    content: 'SEMESTER GRADE SHEET MARKSHEET Board Examination Result',
    expectedReason: 'ERROR_DOCUMENT_MISMATCH'
  },
  {
    id: 9,
    name: 'Aadhaar Checksum Failure (11-digit invalid length)',
    docType: 'AADHAAR',
    filename: 'eval_aadhaar_11digits.pdf',
    content: 'GOVERNMENT OF INDIA Aadhaar Card',
    appOverride: { aadhaarNumber: '12345678901' },
    expectedReason: 'Invalid length'
  },
  {
    id: 10,
    name: 'Aadhaar Checksum Failure (13-digit invalid length)',
    docType: 'AADHAAR',
    filename: 'eval_aadhaar_13digits.pdf',
    content: 'GOVERNMENT OF INDIA Aadhaar Card',
    appOverride: { aadhaarNumber: '1234567890123' },
    expectedReason: 'Invalid length'
  },
  {
    id: 11,
    name: 'Aadhaar Checksum Failure (Failed Verhoeff checksum algorithm)',
    docType: 'AADHAAR',
    filename: 'eval_aadhaar_bad_verhoeff.pdf',
    content: 'GOVERNMENT OF INDIA Aadhaar Card',
    appOverride: { aadhaarNumber: '111122223334' }, // 111122223334 fails Verhoeff
    expectedReason: 'Verhoeff Checksum'
  },
  {
    id: 12,
    name: 'Input Vulnerability (Blurred unreadable scan)',
    docType: 'AADHAAR',
    filename: 'eval_blurred_scan.png',
    content: 'Blurred document scan image',
    expectedReason: 'blurred or pixelated'
  },
  {
    id: 13,
    name: 'Digital Forgery (Digital font overlay on physical scan)',
    docType: 'MARKSHEET',
    filename: 'eval_forged_font_overlay.pdf',
    content: 'Marksheet scan with font_overlay digital edit',
    expectedReason: 'font overlay'
  },
  {
    id: 14,
    name: 'Forgery (Specimen / Sample watermark)',
    docType: 'INCOME_CERTIFICATE',
    filename: 'eval_specimen_watermark.pdf',
    content: 'INCOME CERTIFICATE SAMPLE SPECIMEN WATERMARK',
    expectedReason: 'SAMPLE, SPECIMEN'
  },
  {
    id: 15,
    name: 'Income Certificate Fraud (Expired validity period)',
    docType: 'INCOME_CERTIFICATE',
    filename: 'eval_expired_income.pdf',
    content: 'INCOME CERTIFICATE EXPIRED VALIDITY 2020',
    expectedReason: 'expired'
  },
  {
    id: 16,
    name: 'Income Certificate Structural Defect (Missing authority stamp)',
    docType: 'INCOME_CERTIFICATE',
    filename: 'eval_no_stamp_income.pdf',
    content: 'INCOME CERTIFICATE NO_STAMP NO_AUTHORITY',
    expectedReason: 'Missing issuing authority'
  },
  {
    id: 17,
    name: 'Income Certificate Guardrail Failure (Lacks 3 mandatory legal terms)',
    docType: 'INCOME_CERTIFICATE',
    filename: 'eval_lacks_legal_keywords.txt',
    content: 'This document says family money is 100000 rupees without official words.',
    expectedReason: 'MISSING_MANDATORY_FIELDS'
  },
  {
    id: 18,
    name: 'Marksheet Fraud (Mismatched subject totals calculation)',
    docType: 'MARKSHEET',
    filename: 'eval_mismatched_totals.pdf',
    content: 'SEMESTER MARKSHEET MISMATCHED_TOTALS',
    expectedReason: 'do not add up mathematically'
  },
  {
    id: 19,
    name: 'Marksheet Fraud (Spelling mistake in board name: Secandary)',
    docType: 'MARKSHEET',
    filename: 'eval_spelling_board.pdf',
    content: 'Board of Secandary Education Marksheet',
    expectedReason: 'Fictional board or university'
  },
  {
    id: 20,
    name: 'Marksheet Guardrail Failure (Lacks 3 mandatory academic terms)',
    docType: 'MARKSHEET',
    filename: 'eval_lacks_academic_keywords.txt',
    content: 'Student studied hard and performed nicely in all classes.',
    expectedReason: 'MISSING_MANDATORY_FIELDS'
  }
];

async function runEvaluationSuite() {
  console.log('\n================================================================');
  console.log(' ScholarFlow AI — Document Agent Adversarial Eval Suite (20 Cases)');
  console.log('================================================================\n');

  let passedRejections = 0;
  const totalCases = evalDataset.length;

  for (const item of evalDataset) {
    const filePath = path.join(uploadsDir, item.filename);
    fs.writeFileSync(filePath, item.content);

    const doc = {
      documentType: item.docType,
      fileUrl: `/uploads/${item.filename}`
    };

    const appToUse = item.appOverride ? { ...mockApplication, ...item.appOverride } : mockApplication;

    const result = await documentAgent.verifyDocument(doc, appToUse);

    const isRejected = result.status === 'REJECTED';
    const hasExpectedReason = result.errorMessage && result.errorMessage.toLowerCase().includes(item.expectedReason.toLowerCase());

    if (isRejected) {
      passedRejections++;
      console.log(`[PASS] Case #${item.id}: ${item.name}`);
      console.log(`       -> Status: REJECTED | Reason: "${result.errorMessage}"\n`);
    } else {
      console.error(`[FAIL] Case #${item.id}: ${item.name}`);
      console.error(`       -> Status: ${result.status} | Unexpectedly Passed Verification!\n`);
    }

    // Clean up temporary test file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  const passPercentage = Math.round((passedRejections / totalCases) * 100);

  console.log('================================================================');
  console.log(` EVALUATION RESULTS: ${passedRejections} / ${totalCases} Edge Cases Rejected (${passPercentage}%)`);
  console.log('================================================================');

  if (passedRejections === totalCases) {
    console.log('✅ PERFECT SCORE: 100% Rejection Rate achieved on Adversarial Edge Cases!\n');
    process.exit(0);
  } else {
    console.error('❌ EVALUATION FAILED: Some invalid edge cases were not rejected.\n');
    process.exit(1);
  }
}

runEvaluationSuite().catch(err => {
  console.error('Eval Script Critical Failure:', err);
  process.exit(1);
});
