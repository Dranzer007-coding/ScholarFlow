const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Hash passwords
  const salt = await bcrypt.genSalt(10);
  const studentPasswordHash = await bcrypt.hash('password123', salt);
  const officerPasswordHash = await bcrypt.hash('scholar1234', salt);

  // Clean existing data
  await prisma.notification.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.agentResult.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.scholarship.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Users
  const student = await prisma.user.create({
    data: {
      name: 'Rahul Sharma',
      email: 'rahul@student.com',
      passwordHash: studentPasswordHash,
      role: 'STUDENT'
    }
  });

  const officer = await prisma.user.create({
    data: {
      name: 'Aachal Gupta',
      email: 'scholarflow_off@gmail.com',
      passwordHash: officerPasswordHash,
      role: 'OFFICER'
    }
  });

  console.log(`Created student: ${student.email}`);
  console.log(`Created officer: ${officer.email}`);

  // 2. Create Scholarships
  const s1 = await prisma.scholarship.create({
    data: {
      title: 'National Merit-cum-Means Scholarship',
      description: 'Awarded to meritorious students from economically weaker sections to cover tuition expenses.',
      criteriaMinCgpa: 7.5,
      criteriaMaxIncome: 250000.0,
      criteriaCategory: 'GENERAL',
      amount: 50000.0
    }
  });

  const s2 = await prisma.scholarship.create({
    data: {
      title: 'Post-Matric Scholarship Scheme for SC students',
      description: 'Financial assistance for post-matriculation courses to promote higher education among Scheduled Castes.',
      criteriaMinCgpa: 6.0,
      criteriaMaxIncome: 300000.0,
      criteriaCategory: 'SC',
      amount: 35000.0
    }
  });

  const s3 = await prisma.scholarship.create({
    data: {
      title: 'Pragati Scholarship Scheme for OBC students',
      description: 'Support to empower technical education for students from backward classes with academic merit.',
      criteriaMinCgpa: 7.0,
      criteriaMaxIncome: 450000.0,
      criteriaCategory: 'OBC',
      amount: 50000.0
    }
  });

  console.log(`Created scholarships: ${s1.title}, ${s2.title}, ${s3.title}`);

  // 3. Create a seeded application under OFFICER_REVIEW status
  const application = await prisma.application.create({
    data: {
      studentId: student.id,
      scholarshipId: s1.id,
      status: 'OFFICER_REVIEW',
      currentStage: 'OFFICER_REVIEW',
      cgpa: 8.8,
      annualIncome: 180000.0,
      category: 'GENERAL',
      course: 'B.Tech Computer Science',
      college: 'Kalinga Institute of Industrial Technology',
      bankAccountNumber: '918273645012',
      ifscCode: 'SBIN0001234',
      aadhaarNumber: '123456789012'
    }
  });

  // Create documents
  await prisma.document.createMany({
    data: [
      {
        applicationId: application.id,
        documentType: 'AADHAAR',
        fileUrl: '/uploads/aadhaar.pdf',
        status: 'VERIFIED',
        confidence: 0.98,
        extractedText: 'GOVERNMENT OF INDIA. AADHAAR CARD. Name: Rahul Sharma. UID: 1234 5678 9012. DOB: 12/04/2005.',
        metadata: JSON.stringify({ name: 'Rahul Sharma', uid: '123456789012', dob: '12/04/2005' })
      },
      {
        applicationId: application.id,
        documentType: 'INCOME_CERTIFICATE',
        fileUrl: '/uploads/income.pdf',
        status: 'VERIFIED',
        confidence: 0.95,
        extractedText: 'INCOME CERTIFICATE. Annual Family Income: INR 1,80,000. Household head: Service.',
        metadata: JSON.stringify({ annualIncome: '180000', headOfFamily: 'Service' })
      },
      {
        applicationId: application.id,
        documentType: 'MARKSHEET',
        fileUrl: '/uploads/marksheet.pdf',
        status: 'VERIFIED',
        confidence: 0.99,
        extractedText: 'ACADEMIC TRANSCRIPT. Cumulative Grade Point Average (CGPA): 8.8 / 10.0. Program: B.Tech CSE.',
        metadata: JSON.stringify({ cgpa: '8.8', program: 'B.Tech Computer Science' })
      }
    ]
  });

  // Create AI agent results
  await prisma.agentResult.createMany({
    data: [
      {
        applicationId: application.id,
        agentType: 'DOCUMENT',
        status: 'SUCCESS',
        confidence: 0.95,
        resultData: JSON.stringify({ allDocsValid: true })
      },
      {
        applicationId: application.id,
        agentType: 'ELIGIBILITY',
        status: 'SUCCESS',
        confidence: 0.99,
        resultData: JSON.stringify({
          cgpa: { status: 'PASS', required: 7.5, extracted: 8.8 },
          income: { status: 'PASS', limit: 250000, extracted: 180000 },
          category: { status: 'PASS', extracted: 'GENERAL' }
        })
      },
      {
        applicationId: application.id,
        agentType: 'FRAUD',
        status: 'SUCCESS',
        confidence: 0.99,
        resultData: JSON.stringify({ duplicateAadhaar: false, summary: 'No duplicate Aadhaar found in other applications.' })
      },
      {
        applicationId: application.id,
        agentType: 'COPILOT',
        status: 'SUCCESS',
        confidence: 0.95,
        resultData: JSON.stringify({
          recommendation: 'APPROVE',
          summary: 'Student meets all academic merit criteria and family income thresholds with valid documents.',
          reasoning: 'CGPA 8.8 >= 7.5 and Income 180k <= 250k.'
        })
      }
    ]
  });

  // Create audit logs
  await prisma.auditLog.createMany({
    data: [
      {
        applicationId: application.id,
        actorType: 'USER',
        action: 'APPLICATION_DRAFT_CREATED',
        details: 'Application draft initialized by Rahul Sharma'
      },
      {
        applicationId: application.id,
        actorType: 'USER',
        action: 'DOCUMENTS_UPLOADED',
        details: 'Uploaded AADHAAR, INCOME_CERTIFICATE, MARKSHEET scans.'
      },
      {
        applicationId: application.id,
        actorType: 'USER',
        action: 'APPLICATION_SUBMITTED',
        details: 'Application submitted for automatic verifications.'
      },
      {
        applicationId: application.id,
        actorType: 'SYSTEM',
        action: 'STAGE_TRANSITION',
        details: 'Moved to workflow stage: OFFICER_REVIEW'
      }
    ]
  });

  console.log(`Created officer review application ID: ${application.id} for student ${student.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
