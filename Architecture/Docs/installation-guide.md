# Installation Guide

## Prerequisites

Before running ScholarFlow AI, ensure the following software is installed:

- Node.js (v18 or above)
- PostgreSQL
- Git
- Visual Studio Code
- npm (comes with Node.js)

---

## Clone the Repository

```bash
git clone <repository-url>
```

---

## Install Dependencies

### Frontend

```bash
cd frontend
npm install
```

### Backend

```bash
cd backend
npm install
```

---

## Configure Environment Variables

Create a `.env` file in the backend folder and configure:

```env
DATABASE_URL=<database-url>
JWT_SECRET=<your-secret-key>
GEMINI_API_KEY=<your-api-key>
```

---

## Start the Backend

```bash
npm run dev
```

---

## Start the Frontend

```bash
npm start
```

---

## Access the Application

Frontend:

```
http://localhost:3000
```

Backend:

```
http://localhost:5000
```

---

## Notes

- Ensure PostgreSQL is running before starting the backend.
- Verify that all environment variables are correctly configured.
- Use a valid Gemini API key for AI functionality.