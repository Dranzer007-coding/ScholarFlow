# Custom Agents & Skills Documentation

This document describes the custom agents and custom skills built into ScholarFlow AI, satisfying checkpoint 4 of the hackathon entry criteria.

---

## 1. Custom Agent: Fraud Detection Agent

Our primary custom agent is the **Fraud Detection Agent** (`src/agents/fraud.agent.js`).

### Purpose and Logic
While typical scholarship applications evaluate applicants in isolation, the Fraud Detection Agent performs a systemic review across all historic and active database records to flag fraud syndicates, duplicate applications, and certificate recycling.

### Implementation Details
- **Cross-Reference Scan**: Queries the database to discover duplicates of the Aadhaar number or bank account number across different student accounts.
- **Risk Scoring Algorithm**: Generates a numeric fraud risk metric:
  - Same Aadhaar in other applications: +0.6 risk
  - Same Bank Account under a different student: +0.3 risk
  - Other active applications by the same student: +0.1 risk
- **Status Classification**:
  - Risk Score `0.0`: `SUCCESS` (Clean)
  - Risk Score `0.1 - 0.5`: `WARNING` (Medium Risk - e.g. student applied for two schemes)
  - Risk Score `>= 0.6`: `FAILED` (High Risk - duplicate Aadhaar)
- **AI Synthesis**: Feeds these metrics to Gemini to write a readable, explainable report explaining the fraud flags.

---

## 2. Custom Skill: Document Parse and Validation Skill

Our custom skill is the **Document Parse and Validation Skill** (`src/agents/document.agent.js` and `src/services/workflow.service.js`).

### Purpose and Logic
This skill implements the process of ingesting raw uploads, running simulated OCR extraction, verifying OCR text fields against the user's input, and classifying document readability.

### Integration details
- **Target Files**: Aadhaar Card, Income Certificate, Semester Marksheet.
- **Verification Engine**:
  - Reads document properties.
  - OCR details are cross-referenced with application fields (Aadhaar length, family income ceiling, CGPA).
  - Flags mismatches (e.g. if the marksheet CGPA is below the minimum required limit or if the certificate is unreadable).
- **Audit Logs integration**: Logs every document's OCR result, confidence score, and status directly in the database (`Document` model), which is visible on the review screen.
