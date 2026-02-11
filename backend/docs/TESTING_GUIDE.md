# Completed Features & Testing Guide

This document lists all implemented features in the Hirotix Backend and provides a step-by-step guide to test them.

## ✅ Completed Features

### 1. User Identity (Phase 1)
- **Register**: Create new accounts for Recruiters or Seekers.
- **Login**: Authenticate and receive a User object (Session/JWT not strictly enforced yet, basic auth flow).
- **Users**: Retrieve user details.

### 2. Profiles (Phase 1 & 3)
- **View Profile**: Get profile details for a user.
- **Update Profile**: Modify skills, education, experience, etc.
- **Resume Upload**: Upload a PDF/Doc resume which is saved to the server.

### 3. Jobs (Phase 2 & 3)
- **Post Job**: Recruiters can create new job postings.
- **My Jobs**: Recruiters can see jobs they posted.
- **All Jobs**: Public endpoint to see all jobs.
- **Job Details**: View a specific job.
- **Search Jobs**: Filter jobs by title/description and location.
- **Delete Job**: Remove a job posting.

### 4. Applications (Phase 2)
- **Apply**: Seekers can apply to a specific job.
- **View Job Applications**: Recruiters can see who applied to their job.
- **My Applications**: Seekers can see jobs they have applied to.

---

## 🧪 Test Plan

You can test these endpoints using **Postman**, **cURL**, or any API client.
**Base URL**: `http://localhost:8080/api`

### 1. Authentication

#### Register a Recruiter
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Alice Recruiter",
    "email": "alice@example.com",
    "password": "password123",
    "role": "RECRUITER"
  }'
```
*Save the `id` from the response (e.g., `1`).*

#### Register a Seeker
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Bob Seeker",
    "email": "bob@example.com",
    "password": "password123",
    "role": "SEEKER"
  }'
```
*Save the `id` from the response (e.g., `2`).*

#### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "password123"
  }'
```

### 2. Jobs

#### Post a Job (as Recruiter)
```bash
curl -X POST "http://localhost:8080/api/jobs?recruiterId=1" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Java Developer",
    "description": "We need an expert in Spring Boot.",
    "location": "Pune",
    "salary": "2000000",
    "jobType": "FULL_TIME",
    "experienceLevel": "SENIOR"
  }'
```
*Save the `id` from the response (e.g., `1`).*

#### Search Jobs
```bash
curl "http://localhost:8080/api/jobs/search?query=Java&location=Pune"
```

#### Get All Jobs
```bash
curl http://localhost:8080/api/jobs
```

### 3. Profiles & Resumes

#### Update Profile
```bash
curl -X PUT http://localhost:8080/api/profiles/2 \
  -H "Content-Type: application/json" \
  -d '{
    "headline": "Enthusiastic Java Developer",
    "skills": "Java, Spring, MySQL",
    "location": "Mumbai",
    "education": "B.Tech CS",
    "experience": "2 Years"
  }'
```

#### Upload Resume
*Note: Use Postman for file uploads or this curl command if you have a file.*
```bash
curl -X POST "http://localhost:8080/api/profiles/2/resume" \
  -F "file=@/path/to/your/resume.pdf"
```

### 4. Applications

#### Apply to Job (as Seeker)
```bash
# User 2 applying to Job 1
curl -X POST "http://localhost:8080/api/jobs/1/apply?userId=2"
```

#### View Applications (as Recruiter)
```bash
curl "http://localhost:8080/api/jobs/1/applications"
```

#### View My Applications (as Seeker)
```bash
curl "http://localhost:8080/api/applications?userId=2"
```
