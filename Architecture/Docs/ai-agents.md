# AI Agents Documentation

## Introduction

ScholarFlow AI uses multiple AI agents to automate different stages of the scholarship approval process. Each agent performs a specific task and collaborates with other agents to improve efficiency, accuracy, and transparency.

---

# 1. OCR Agent

### Purpose
Extracts text and important information from uploaded documents.

### Input
- Aadhaar Card
- Income Certificate
- Marksheet
- Bank Passbook

### Output
Structured text extracted from documents.

---

# 2. Document Verification Agent

### Purpose
Checks whether uploaded documents are valid, readable, and complete.

### Responsibilities
- Verify document quality
- Check missing pages
- Validate required documents
- Detect invalid uploads

---

# 3. Eligibility Checking Agent

### Purpose
Determines whether the student satisfies scholarship eligibility criteria.

### Checks
- Academic performance
- Income limit
- Category requirements
- Age criteria (if applicable)

---

# 4. Fraud Detection Agent

### Purpose
Identifies suspicious or fraudulent scholarship applications.

### Detects
- Duplicate applications
- Fake documents
- Data inconsistencies
- Suspicious submission patterns

---

# 5. Officer Recommendation Agent

### Purpose
Generates an AI-assisted recommendation for the officer.

### Recommendation Types
- Approve
- Reject
- Request More Information

The final decision always remains with the officer.

---

# 6. Notification Agent

### Purpose
Keeps users informed about application progress.

### Sends Notifications For
- Application submitted
- Verification completed
- Additional documents required
- Approved
- Rejected

---

# Human-in-the-Loop

ScholarFlow AI does not replace scholarship officers.

AI provides intelligent recommendations, but the final approval or rejection is always made by the authorized officer to ensure accountability and transparency.