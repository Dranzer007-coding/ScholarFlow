# ScholarFlow AI — Backend API Engine

This is the backend API engine and agentic workflow server for **ScholarFlow AI** (an agent-driven scholarship processing and approval platform).

## Directory Structure

```text
backend/
├── prisma/
│   ├── schema.prisma       # Database schema definition
│   └── seed.js             # Seeding script with dummy users & scholarships
├── src/
│   ├── config/
│   │   ├── database.js     # Prisma client provider
│   │   └── env.js          # Environment configuration
│   ├── controllers/        # Express API request controllers
│   ├── middleware/         # JWT Verification & global error handling
│   ├── routes/             # API route endpoints
│   ├── services/
│   │   ├── ai.service.js   # Gemini API adapter
│   │   └── workflow.service.js # Orchestration pipeline
│   ├── agents/             # Modular specialized AI agents
│   ├── app.js              # Express app definition
│   └── server.js           # Server startup script
├── tests/
│   └── api.test.js         # Integration tests with Jest & Supertest
└── uploads/                # Temporary directory for local file uploads
```

---

## Local Setup

### 1. Prerequisites
Ensure you have the following installed on your machine:
* **Node.js** (LTS version recommended)
* **npm** (v10+ or equivalent package manager)

### 2. Install Dependencies
Change directory to the `backend` folder and run:
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the `backend/` directory (or copy from `.env.example`).
Adjust the variables if necessary:
```env
PORT=5000
DATABASE_URL="file:./dev.db"
JWT_SECRET="scholarflow_secret_key_12345"
GEMINI_API_KEY="your-gemini-api-key"
NODE_ENV="development"
```

*Note: If `GEMINI_API_KEY` is not provided, the specialized agents will automatically fall back to high-fidelity rule-based evaluations so the platform can be demoed without keys.*

### 4. Database Setup (Migrations & Seeding)
Configure your database by running the setup script:
```bash
npm run db:setup
```
This runs:
1. `prisma generate` to compile the client.
2. `prisma migrate dev` to create the local SQLite database file `prisma/dev.db` and apply schema tables.
3. `prisma seed` to populate a mock student account (`rahul@student.com` / `password123`), officer account (`scholarflow_off@gmail.com` / `scholar1234`), and three default scholarships.

---

## Running the Server

Start the API server in development mode with hot-reloading:
```bash
npm run dev
```

The server starts listening on **http://localhost:5000**.
* Health Check Endpoint: **http://localhost:5000/api/health**

---

## Running Tests

To run the Jest integration test suite verifying registrations, logins, scholarship listings, and drafts:
```bash
npm test
```
