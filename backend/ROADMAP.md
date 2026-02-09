# Hirotix Backend Implementation Plan

## Goal Description
Build a scalable and robust backend for the **Hirotix AI Job Portal**. The system will handle user authentication, job management, candidate applications, and intelligent features like AI-based resume parsing and job matching.

## User Review Required
> [!NOTE]
> This plan assumes the use of **Spring Boot** (Java) and **MySQL**.
> AI integration will require API keys (e.g., OpenAI, Gemini) which need to be configured securely.

## Current Status
The following modules have been implemented:
- **Authentication**: User registration and login.
- **Profiles**: User profile management.
- **Jobs**: Basic CRUD operations for job postings.

## Phase 2: Jobs & Applications (Day 3-4)

### 1. Enhanced Job Entity
- **Goal**: Add missing fields for a complete job posting.
- **Files**:
  - [MODIFY] [Job.java](file:///d:/Projects/College/Hirotix/backend/hirotix-backend/src/main/java/com/hirotix/backend/entity/Job.java)
    - Add `recruiter` (ManyToOne User)
    - Add `salary` (String)
    - Add `jobType` (String: FULL_TIME, PART_TIME, etc.)
    - Add `experienceLevel` (String: ENTRY, MID, SENIOR)
    - Add `postedDate` (LocalDateTime)
  - [MODIFY] [JobController.java](file:///d:/Projects/College/Hirotix/backend/hirotix-backend/src/main/java/com/hirotix/backend/controller/JobController.java)
    - Update `createJob` to link the logged-in user (recruiter).
    - Add `getMyJobs` endpoint.

### 2. Application System
- **Goal**: Allow seekers to apply and recruiters to view applications.
- **Files**:
  - [NEW] [Application.java](file:///d:/Projects/College/Hirotix/backend/hirotix-backend/src/main/java/com/hirotix/backend/entity/Application.java)
    - Fields: `id`, `seeker` (User), `job` (Job), `status` (String: APPLIED, SHORTLISTED, REJECTED), `appliedDate`.
  - [NEW] [ApplicationRepository.java](file:///d:/Projects/College/Hirotix/backend/hirotix-backend/src/main/java/com/hirotix/backend/repository/ApplicationRepository.java)
  - [NEW] [ApplicationService.java](file:///d:/Projects/College/Hirotix/backend/hirotix-backend/src/main/java/com/hirotix/backend/service/ApplicationService.java)
    - Methods: `applyToJob(userId, jobId)`, `getApplicationsForJob(jobId)`, `getMyApplications(userId)`.
  - [NEW] [ApplicationController.java](file:///d:/Projects/College/Hirotix/backend/hirotix-backend/src/main/java/com/hirotix/backend/controller/ApplicationController.java)
    - `POST /api/jobs/{id}/apply`
    - `GET /api/applications`
    - `GET /api/jobs/{id}/applications`

## Phase 3: Search & Files (Day 5)

## Verification Plan

### Automated Tests
- Run `mvn test` to execute existing unit tests.
- Create new tests for `ApplicationService`:
  ```bash
  mvn test -Dtest=ApplicationServiceTest
  ```

### Manual Verification
- **Apply Flow**:
  1. Login as User.
  2. List Jobs -> Get Job ID.
  3. Send `POST /api/applications` with Job ID.
  4. Verify Application is created in DB.
- **AI Flow**:
  1. Upload Resume via `POST /api/resume/analyze`.
  2. Verify JSON response contains "match_score".
