# Hirotix Backend - 1 Week Implementation Roadmap

## Phase 1: Identity & Profiles (Day 1-2) [COMPLETED]
- [x] **Roles & Security**
  - [x] Update User entity to include Role (ADMIN, RECRUITER, SEEKER)
  - [x] Implement Login/Register APIs
  - [x] Implement JWT/Session Auth
- [x] **Profiles**
  - [x] Create Profile entity linked to User
  - [x] Fields: Skills, Education, Experience, Location, Title
  - [x] API: `GET /api/profile`, `PUT /api/profile`

## Phase 2: Jobs & Applications (Day 3-4) [CURRENT]
- [x] **Recruiter Features**
  - [x] Update `Job` entity: Link to User (Recruiter), Salary, Job Type, Experience Level
  - [x] API: `POST /api/jobs` (Ensure only Recruiters can post)
  - [x] API: `GET /api/jobs/my-jobs` (Jobs posted by logged-in recruiter)
- [x] **Job Applications**
  - [x] Create `Application` entity (User <-> Job)
  - [x] Fields: Status (APPLIED, SHORTLISTED, REJECTED), AppliedDate
  - [x] API: `POST /api/jobs/{id}/apply`
  - [x] API: `GET /api/applications` (Seeker view)
  - [x] API: `GET /api/jobs/{id}/applications` (Recruiter view)

## Phase 3: Search & Files (Day 5) [PENDING]
- [ ] **Search**
  - [ ] Filter Jobs by Location, Title, Skills
  - [ ] API: `GET /api/jobs/search?query=java&location=pune`
- [ ] **Resume Upload**
  - [ ] API: `POST /api/users/resume`
  - [ ] Storage: Save PDF to local uploads folder
  - [ ] DB: Store file path in Profile

## Phase 4: AI Bridge (Day 6-7) [PENDING]
- [ ] **AI Integration Service**
  - [ ] Java Service using RestTemplate/WebClient
  - [ ] API: `POST /api/ai/parse-resume` -> Calls Python
  - [ ] API: `POST /api/ai/match-jobs` -> Calls Python
