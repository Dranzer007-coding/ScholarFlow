const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/config/database');

beforeAll(async () => {
  // Clean up any test records
  await prisma.notification.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.agentResult.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.scholarship.deleteMany({});
  await prisma.user.deleteMany({});

  // Seed test officer directly
  const bcrypt = require('bcryptjs');
  const passwordHash = await bcrypt.hash('password123', 10);
  await prisma.user.create({
    data: {
      name: 'Test Officer',
      email: 'testofficer@example.com',
      passwordHash,
      role: 'OFFICER'
    }
  });
});

afterAll(async () => {
  // Re-seed demo users so manual login credentials (rahul@student.com / scholarflow_off@gmail.com) always remain active
  const bcrypt = require('bcryptjs');
  const studentHash = await bcrypt.hash('password123', 10);
  const officerHash = await bcrypt.hash('scholar1234', 10);

  await prisma.user.upsert({
    where: { email: 'rahul@student.com' },
    update: { passwordHash: studentHash },
    create: { name: 'Rahul Sharma', email: 'rahul@student.com', passwordHash: studentHash, role: 'STUDENT' }
  });

  await prisma.user.upsert({
    where: { email: 'scholarflow_off@gmail.com' },
    update: { passwordHash: officerHash },
    create: { name: 'Aachal Gupta', email: 'scholarflow_off@gmail.com', passwordHash: officerHash, role: 'OFFICER' }
  });

  // Close database connection
  await prisma.$disconnect();
});

describe('ScholarFlow AI Backend API Endpoints', () => {
  let studentToken;
  let officerToken;
  let scholarshipId;
  let applicationId;

  test('GET /api/health - Health check status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('running smoothly');
  });

  test('POST /api/auth/register - Register a test student', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Student',
        email: 'teststudent@example.com',
        password: 'password123',
        role: 'STUDENT'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    studentToken = res.body.data.token;
  });

  test('POST /api/auth/register - Register a test officer should fail', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Another Officer',
        email: 'another@example.com',
        password: 'password123',
        role: 'OFFICER'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/auth/login - Log in officer and check token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testofficer@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    officerToken = res.body.data.token;
  });

  test('POST /api/auth/login - Log in student and check token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'teststudent@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  test('POST /api/scholarships - Create scholarship (Officer authorized)', async () => {
    const res = await request(app)
      .post('/api/scholarships')
      .set('Authorization', `Bearer ${officerToken}`)
      .send({
        title: 'Test Excellence Grant',
        description: 'A special grant for students with excellent scores.',
        criteriaMinCgpa: 8.0,
        criteriaMaxIncome: 300000.0,
        criteriaCategory: 'GENERAL',
        amount: 25000.0
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    scholarshipId = res.body.data.id;
  });

  test('GET /api/scholarships - Retrieve scholarships list', async () => {
    const res = await request(app).get('/api/scholarships');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test('POST /api/applications - Reject invalid Bank Account Number format', async () => {
    const res = await request(app)
      .post('/api/applications')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        scholarshipId: scholarshipId,
        cgpa: 8.5,
        annualIncome: 150000.0,
        category: 'GENERAL',
        course: 'B.Tech',
        college: 'Test University',
        bankAccountNumber: 'ABC123INVALID',
        ifscCode: 'TEST0001234',
        aadhaarNumber: '111122223333'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Bank Account Number');
  });

  test('POST /api/applications - Reject invalid IFSC Code format', async () => {
    const res = await request(app)
      .post('/api/applications')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        scholarshipId: scholarshipId,
        cgpa: 8.5,
        annualIncome: 150000.0,
        category: 'GENERAL',
        course: 'B.Tech',
        college: 'Test University',
        bankAccountNumber: '1234567890',
        ifscCode: 'INVALID_IFSC_CODE',
        aadhaarNumber: '111122223333'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('IFSC');
  });

  test('POST /api/applications - Create a draft application', async () => {
    const res = await request(app)
      .post('/api/applications')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        scholarshipId: scholarshipId,
        cgpa: 8.5,
        annualIncome: 150000.0,
        category: 'GENERAL',
        course: 'B.Tech',
        college: 'Test University',
        bankAccountNumber: '1234567890',
        ifscCode: 'TEST0001234',
        aadhaarNumber: '111122223333'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    applicationId = res.body.data.id;
  });

  test('GET /api/applications/student - Get student applications', async () => {
    const res = await request(app)
      .get('/api/applications/student')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
  });
});
