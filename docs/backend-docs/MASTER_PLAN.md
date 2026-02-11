# Hirotix AI Job Portal - Master Plan & Status

## 🎯 Goal
Build a scalable and robust backend for the **Intelligent AI-Powered Job Portal** in 1 week.

## 🏗 Architecture
**Frontend** <--> **Spring Boot (Backend)** <--> **Database (MySQL)**
                          ^
                          |
                    **Python AI Service**

## ✅ Completed Modules

### Phase 1: Identity & Profiles
- **Roles**: Admin, Recruiter, Seeker.
- **Auth**: Register, Login (Returns User object).
- **Profiles**: Create/Update interactions.

### Phase 2: Jobs & Applications
- **Jobs**:
    - Recruiters can post jobs (Title, Salary, Type, Experience).
    - Recruiters can view their posted jobs (`GET /api/jobs/my-jobs`).
- **Applications**:
    - Seekers can apply to jobs (`POST /api/jobs/{id}/apply`).
    - Seekers can view their applications (`GET /api/applications`).
    - Recruiters can view applicants (`GET /api/jobs/{id}/applications`).

## 📋 Testing Guide (Postman)
**1. Register**: `POST /api/auth/register`
   - Payload: `{"fullName": "...", "email": "...", "password": "...", "role": "RECRUITER"}`
**2. Login**: `POST /api/auth/login`
**3. Post Job**: `POST /api/jobs?recruiterId={id}`
**4. Apply**: `POST /api/jobs/{id}/apply?userId={id}`

## 🚀 Next Steps (Pending)

### Phase 3: Search & Files (Day 5)
- [ ] **Search API**: Filter jobs by Location, Title, Skills.
    - Endpoint: `GET /api/jobs/search?query=java&location=pune`
- [ ] **Resume Upload**:
    - Endpoint: `POST /api/users/resume`
    - Logic: Save PDF locally and store path in Profile entity.

### Phase 4: AI Bridge (Day 6-7)
- [ ] **AI Integration Service**:
    - REST Client (RestTemplate/WebClient) to talk to Python.
    - `POST /api/ai/parse-resume`
    - `POST /api/ai/match-jobs`
