# API Documentation

## Introduction

This document describes the APIs used in the ScholarFlow AI system. These APIs allow communication between the frontend, backend, database, and AI services.

---

# 1. Register Student

### Endpoint

POST /api/auth/register

### Purpose

Registers a new student account.

### Request

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@gmail.com",
  "password": "password123"
}
```

### Response

```json
{
  "message": "Registration Successful"
}
```

---

# 2. Login

### Endpoint

POST /api/auth/login

### Purpose

Authenticates students and officers.

### Response

```json
{
  "token": "JWT_TOKEN",
  "role": "student"
}
```

---

# 3. Submit Scholarship Application

### Endpoint

POST /api/application

### Purpose

Submits a scholarship application.

---

# 4. Upload Documents

### Endpoint

POST /api/upload

### Purpose

Uploads required documents such as Aadhaar, Income Certificate, Marksheet, and Bank Passbook.

---

# 5. AI Verification

### Endpoint

POST /api/verify

### Purpose

Starts AI-powered document verification.

---

# 6. Get Application Status

### Endpoint

GET /api/application/status

### Purpose

Returns the current scholarship application status.

---

# 7. Officer Dashboard

### Endpoint

GET /api/officer/applications

### Purpose

Returns all pending scholarship applications.

---

# 8. Approve / Reject Application

### Endpoint

POST /api/officer/decision

### Purpose

Allows the officer to approve, reject, or request corrections.

---

# 9. Notifications

### Endpoint

GET /api/notifications

### Purpose

Returns notifications for the logged-in user.