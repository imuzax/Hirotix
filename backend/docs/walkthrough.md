# Hirotix Backend - Testing Guide (Postman)

## What is Completed? :white_check_mark:

### Phase 1: Identity & Profiles
- **User**: Register, Login.
- **Profile**: Create/Update specific profile details (Skills, Education).

### Phase 2: Jobs & Applications
- **Jobs (Recruiter)**:
  - Post detailed jobs (Salary, Type, Experience).
  - Link jobs to a Recruiter account.
  - View "My Posted Jobs".
- **Applications (Seeker)**:
  - Apply to a specific Job.
  - View "My Applications" with status.
- **Applications (Recruiter)**:
  - View all applicants for a specific Job.

---

## How to Test in Postman

Follow these steps in order to test the full flow.

### 1. Register Users
Create two users: one Recruiter and one Job Seeker.

**Request**: `POST http://localhost:8080/api/auth/register`
**Body (Recruiter)**:
```json
{
    "fullName": "Alice Recruiter",
    "email": "alice@example.com",
    "password": "password123",
    "role": "RECRUITER"
}
```
**Body (Seeker)**:
```json
{
    "fullName": "Bob Seeker",
    "email": "bob@example.com",
    "password": "password123",
    "role": "SEEKER"
}
```
> **Note**: Note down the `id` returned for both users (e.g., Recruiter ID = 1, Seeker ID = 2).

### 2. Login (Verify Registration)
Check if the registration was successful by logging in.

**Request**: `POST http://localhost:8080/api/auth/login`
**Body**:
```json
{
    "email": "alice@example.com",
    "password": "password123"
}
```
- **Response**: Should return the User object (including `id`, `fullName`, `role`).

### 3. Post a Job (Recruiter)
**Request**: `POST http://localhost:8080/api/jobs?recruiterId=1`
**Body**:
```json
{
    "title": "Senior Java Developer",
    "company": "TechCorp",
    "location": "Remote",
    "description": "Looking for an expert in Spring Boot.",
    "salary": "120000",
    "jobType": "FULL_TIME",
    "experienceLevel": "SENIOR"
}
```
> **Note**: Note down the `id` of the created Job (e.g., Job ID = 1).

### 3. View Recruiter's Jobs
**Request**: `GET http://localhost:8080/api/jobs/my-jobs?recruiterId=1`
- Should return the job created above.

### 4. Apply for Job (Seeker)
**Request**: `POST http://localhost:8080/api/jobs/1/apply?userId=2`
- **Response**: Should show status "APPLIED".

### 5. View Applicant's History (Seeker)
**Request**: `GET http://localhost:8080/api/applications?userId=2`
- Should return the application for the Java Developer role.

### 6. View Job Applicants (Recruiter)
**Request**: `GET http://localhost:8080/api/jobs/1/applications`
- Should return Bob Seeker's application.
