# Workflow

## Student Workflow

```text
Student
   │
Register
   │
Login
   │
Select Scholarship
   │
Fill Application Form
   │
Upload Documents
   │
Submit Application
   │
AI Verification Starts
   │
Officer Review
   │
Approved / Rejected
```

---

## Officer Workflow

```text
Officer Login
      │
View Pending Applications
      │
Review AI Verification Report
      │
Check Documents
      │
Approve / Reject / Request Correction
      │
Notification Sent to Student
```

---

## System Workflow

```text
Frontend (React)
       │
Backend (Node.js + Express)
       │
Database (PostgreSQL)
       │
AI Agents
 ├── OCR Agent
 ├── Eligibility Agent
 ├── Fraud Detection Agent
 └── Recommendation Agent
       │
Officer Dashboard
       │
Final Decision
```

---

## Workflow Summary

1. Student submits a scholarship application.
2. Required documents are uploaded securely.
3. AI agents verify documents and extract information.
4. Eligibility and fraud checks are performed.
5. A verification report is generated.
6. The officer reviews the report.
7. The officer approves, rejects, or requests corrections.
8. The student receives a notification about the final decision.