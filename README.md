# ScholarFlow AI 🚀

**ScholarFlow AI** is an intelligent, agent-driven scholarship processing and automated workflow platform. Designed to eliminate manual processing bottlenecks and reduce scholarship fraud, ScholarFlow leverages multi-agent AI automation to perform document verification (OCR), eligibility evaluation, fraud detection, and officer decision assistance.

Live Project Deployed at: https://scholar-flow-bay.vercel.app/
---

## 🌟 Key Features

* **Multi-Agent Processing Engine**:
  * 📄 **Document Verification & OCR Agent**: Validates identity documents (Aadhaar, income certificates) and verifies field matching.
  * ⚖️ **Eligibility Agent**: Evaluates academic metrics (CGPA), income caps, and social categories against scholarship criteria.
  * 🛡️ **Fraud Detection Agent**: Scans historical applications for duplicate bank accounts, recycled identity credentials, and double-dipping risk.
  * 🤖 **Officer Copilot Agent**: Synthesizes agent audit trails into actionable recommendations (`APPROVE`, `REJECT`, `REQUEST_REVISION`) for human verification officers.
  * 🔔 **Notification Agent**: Tracks state transitions and dispatches applicant updates.
* **Role-Based Access Control (RBAC)**: Secure access tailored for Students, Officers, and Admins.
* **Modern Web Dashboard**: Sleek React + Vite interface with visual audit logs, interactive copilot summaries, and anomaly alerts.

---

## 🛠️ Tech Stack

* **Frontend**: React 19, Vite, Lucide React, HTML5 / Vanilla CSS Design System
* **Backend**: Node.js, Express, Prisma ORM, SQLite Database
* **AI Engine**: Google Gemini API (`@google/generative-ai`) with deterministic rule-based fallback
* **Testing & CI/CD**: Jest, Supertest, GitHub Actions

---

## 🚀 Quick Start

### 1. Prerequisites

* Node.js (v18 or higher)
* npm (v9 or higher)

### 2. Repository Setup & Installation

Clone the repository and install dependencies for root, backend, and frontend:

```bash
git clone https://github.com/your-username/ScholarFlow.git
cd ScholarFlow

# Install dependencies across all modules
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the `backend/` directory (refer to `backend/.env.example`):

```env
PORT=5000
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_jwt_secret_key"
GEMINI_API_KEY="your_google_gemini_api_key"
NODE_ENV="development"
```

### 4. Database Initialization & Seeding

Initialize the SQLite database schema and load seed data (scholarships, sample applications, officer credentials):

```bash
cd backend
npm run db:setup
cd ..
```

### 5. Running the Application

To run both backend and frontend concurrently from the root directory:

```bash
npm run dev
```

* **Frontend App**: `http://localhost:5173`
* **Backend API**: `http://localhost:5000/api`

---

## 🔑 Demo Login Credentials

> [!IMPORTANT]
> The **Officer Portal** is restricted to pre-authorized officer credentials to enforce administrative security. Public user registration creates Student accounts only.

| Portal | Role | Email / ID | Password | Portal Features & Access |
| :--- | :---: | :--- | :--- | :--- |
| **Officer Portal** 🛡️ | `OFFICER` | `scholarflow_off@gmail.com` | `scholar1234` | Verification dashboard, AI Copilot recommendations, fraud risk scores, AI Q&A chatbot, and decision authority |
| **Student Portal** 🎓 | `STUDENT` | `rahul@student.com` | `password123` | Scholarship browsing, document submission, and real-time application tracking |

---

## 🧪 Testing & Quality Assurance

### Run Backend Unit & Integration Tests

```bash
cd backend
npm test
```

### Evaluate Agent Accuracy

```bash
cd backend
npm run test:eval
```

### Build Frontend Production Assets

```bash
cd frontend
npm run build
```

---

## ⚙️ CI/CD & GitHub Actions

ScholarFlow includes a continuous integration workflow located at `.github/workflows/ci.yml`. On every pull request or push to `main`, GitHub Actions automatically:
1. Installs Node.js dependencies for backend and frontend.
2. Initializes Prisma Client models.
3. Runs Jest integration test suites.
4. Verifies frontend build compilation.

---

## 📄 License

[MIT License](LICENSE)


---

## 📄 Team Members
Team name: THE BRAINLESS
- Anubrata Das(Roll-25155527)
- Sibun Kumar Sahu(Roll- 25155332)
- Soumyadip Dey(Roll-25155336)
- Anubhab Roy(Roll-25155011)
