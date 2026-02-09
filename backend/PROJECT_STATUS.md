# Hirotix Backend - Project Status

## :white_check_mark: Completed Features (Phase 1 & 2)

### 1. Identity & Profiles
- **Authentication**: Register (`POST /api/auth/register`), Login (`POST /api/auth/login`).
- **Authorization**: Roles (SEEKER, RECRUITER).
- **Profiles**: Create/Update specific profile details.

### 2. Jobs
- **Recruiters** can post detailed jobs (Salary, Type, Experience).
- Jobs are linked to the recruiter who posted them.
- API: `POST /api/jobs`, `GET /api/jobs/my-jobs`.

### 3. Applications
- **Seekers** can apply to jobs.
- **Recruiters** can view applicants for their jobs.
- API: `POST /api/jobs/{id}/apply`, `GET /api/applications`.

---

## :rocket: How to Run
1. **Start Database**: Ensure MySQL is running and `hirotix_db` exists.
2. **Run Server**:
   ```bash
   .\mvnw spring-boot:run
   ```
3. **Test API**: Use Postman (See `walkthrough.md` for detailed steps).

---

## :clipboard: Next Steps (Phase 3)
- **Search**: Filter jobs by Location, Title, Skills.
- **Resume Upload**: File handling for resumes.

---

> This file summarizes the project state as of Phase 2 completion.
