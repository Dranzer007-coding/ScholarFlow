# Test Cases

## Module 1: User Registration

| Test ID | Test Case | Expected Result |
|---------|-----------|----------------|
| TC-01 | Register with valid details | Registration successful |
| TC-02 | Register with existing email | Error message displayed |
| TC-03 | Empty name field | Validation error |
| TC-04 | Invalid email format | Validation error |
| TC-05 | Weak password | Password policy message |

---

## Module 2: Login

| Test ID | Test Case | Expected Result |
|---------|-----------|----------------|
| TC-06 | Correct email and password | Login successful |
| TC-07 | Wrong password | Invalid credentials |
| TC-08 | Empty email | Validation error |
| TC-09 | Empty password | Validation error |

---

## Module 3: Scholarship Application

| Test ID | Test Case | Expected Result |
|---------|-----------|----------------|
| TC-10 | Submit complete application | Application submitted |
| TC-11 | Missing Aadhaar | Upload required message |
| TC-12 | Missing Income Certificate | Upload required message |
| TC-13 | Missing Marksheet | Upload required message |
| TC-14 | Empty application form | Validation error |

---

## Module 4: Document Upload

| Test ID | Test Case | Expected Result |
|---------|-----------|----------------|
| TC-15 | Upload valid PDF | Upload successful |
| TC-16 | Upload image file | Upload successful |
| TC-17 | Upload unsupported file type | Upload rejected |
| TC-18 | Upload corrupted PDF | Error message |
| TC-19 | Upload file larger than limit | Size limit exceeded |

---

## Module 5: AI Verification

| Test ID | Test Case | Expected Result |
|---------|-----------|----------------|
| TC-20 | Valid documents | AI verification successful |
| TC-21 | Fake document | Fraud detected |
| TC-22 | Missing document | Verification failed |
| TC-23 | Blurry document | Low quality warning |

---

## Module 6: Officer Dashboard

| Test ID | Test Case | Expected Result |
|---------|-----------|----------------|
| TC-24 | View pending applications | List displayed |
| TC-25 | Approve application | Status updated |
| TC-26 | Reject application | Status updated |
| TC-27 | Request correction | Student notified |

---

## Module 7: Notifications

| Test ID | Test Case | Expected Result |
|---------|-----------|----------------|
| TC-28 | Application submitted | Notification received |
| TC-29 | Application approved | Notification received |
| TC-30 | Application rejected | Notification received |