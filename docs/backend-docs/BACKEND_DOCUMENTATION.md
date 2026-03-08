# Backend Documentation: Intelligent AI-Powered Job Portal

## 1. Introduction
This document serves as a comprehensive report on the backend development of the **Intelligent AI-Powered Job Portal**. It outlines the architecture, technology stack, database design, implemented modules, and the AI integration that powers the core features of the platform. This document is intended as a record for project guides and future reference.

## 2. Technology Stack
The backend is built using a microservices-inspired architecture, separating the core business logic from the AI processing for better scalability and performance.

### Core Backend
*   **Framework:** Java Spring Boot (v3.x)
*   **Language:** Java 17
*   **Build Tool:** Maven
*   **Data Access:** Spring Data JPA / Hibernate
*   **Database:** MySQL (Relational Database Management System)
*   **Security:** Spring Security & Basic Authentication (Ready for JWT extension)
*   **File Handling:** Local File System (Extensible to Cloud Storage like AWS S3)

### AI Service (Microservice)
*   **Framework:** Python Flask
*   **Language:** Python 3.x
*   **Libraries:** `pdfminer.six` (for PDF text extraction), `requests`, standard `re` (Regex for NLP fallback)

---

## 3. System Architecture
The system follows a client-server architecture with a dedicated AI microservice:

1.  **Client (Frontend/Postman):** Sends REST HTTP requests to the Spring Boot backend.
2.  **Spring Boot Backend (Port 8080):** Handles authentication, business logic, database transactions, and file uploads.
3.  **MySQL Database (Port 3306):** Stores persistent data (Users, Jobs, Profiles, Applications).
4.  **Python AI Service (Port 5000):** A separate Flask process that listens for text or file inputs from the Spring Boot backend, performs Natural Language Processing (NLP) tasks (resume parsing, skill extraction, job similarity matching), and returns JSON scores.

---

## 4. Database Schema (Entities)
The relational database is designed with the following core entities:

### `User` Table
Stores authentication and role information.
*   `id` (Primary Key)
*   `fullName`
*   `email` (Unique)
*   `password` (Encrypted/Hashed)
*   `role` (Enum: `ADMIN`, `RECRUITER`, `SEEKER`)

### `Profile` Table
Stores detailed information for Job Seekers.
*   `id` (Primary Key)
*   `headline`, `skills`, `education`, `experience`, `location`, `githubLink`
*   `resumeFilePath` (Path to the stored PDF file)
*   `user_id` (Foreign Key - One-to-One with User)

### `Job` Table
Stores job postings created by Recruiters.
*   `id` (Primary Key)
*   `title`, `description`, `company`, `location`, `salary`, `jobType`, `experienceLevel`
*   `recruiter_id` (Foreign Key - Many-to-One with User)
*   `postedDate`

### `Application` Table
Links Seekers to the Jobs they have applied for.
*   `id` (Primary Key)
*   `job_id` (Foreign Key - Many-to-One with Job)
*   `seeker_id` (Foreign Key - Many-to-One with User)
*   `status` (Enum: `PENDING`, `REVIEWED`, `REJECTED`, `SHORTLISTED`)
*   `appliedDate`

---

## 5. Implemented Modules & Features

### 5.1. User Authentication Module
*   **Registration:** Users can register as a `SEEKER` or a `RECRUITER`.
*   **Login:** Validates credentials and returns the user object.
*   **Role Management:** Ensures that only recruiters can post jobs and only seekers can apply.

### 5.2. Profile & Resume Management (Seeker Module)
*   **Profile Creation/Update:** Seekers can update their skills, education, and experience.
*   **Resume Upload:** Accepts multipart file uploads (.pdf, .txt). Files are saved to a dedicated `resumes/` directory on the server, and the file path is linked to the user's profile in the database.

### 5.3. Job Management (Recruiter Module)
*   **Post Job:** Recruiters can publish new job openings with detailed descriptions.
*   **View Own Jobs:** Recruiters can fetch a list of jobs they have posted (`/my-jobs`).
*   **Delete Job:** Recruiters can remove outdated job postings.

### 5.4. Application Tracking Module
*   **Apply for Job:** Seekers can submit an application for a specific job ID.
*   **View Applications (Recruiter):** Recruiters can see all seekers who applied for their specific job.
*   **View My Applications (Seeker):** Seekers can track all jobs they have applied to.

### 5.5. Search & Filtering Module
*   **Keyword & Location Search:** A robust `GET /search` API allows filtering of all active jobs using SQL `LIKE` queries on job titles, descriptions, and locations.

### 5.6. AI Bridge Module (Intelligent Processing)
This is the core differentiating factor of the project, completely fulfilling the "Intelligent AI-Powered" requirement in the synopsis.
*   **Resume Parsing (`/api/ai/parse-resume/{userId}`):**
    *   Spring Boot fetches the user's stored resume file path.
    *   It sends the file via HTTP POST to the Python Flask AI Service.
    *   Python extracts text using `pdfminer` and uses regex/NLP logic to identify core technical skills (e.g., Java, Spring, React, AWS).
    *   Spring Boot receives the skills array and automatically updates the Seeker's database profile.
*   **Job Recommendation (`/api/ai/match-jobs/{userId}`):**
    *   Spring Boot gathers the user's extracted skills/profile text and all active job descriptions in the database.
    *   It sends this data block to the Python AI Service.
    *   Python calculates a similarity score (using Jaccard similarity/intersection logic) between the resume and each job.
    *   Spring Boot returns a ranked list of jobs to the user, acting as a personalized recommendation engine.

---

## 6. API Endpoints Summary

### Auth (`/api/auth`)
*   `POST /register`
*   `POST /login`

### Profiles (`/api/profiles`)
*   `GET /{userId}`
*   `PUT /{userId}`
*   `POST /{userId}/resume` (Multipart File)

### Jobs (`/api/jobs`)
*   `POST ?recruiterId={id}` (Create Job)
*   `GET` (All Jobs)
*   `GET /my-jobs?recruiterId={id}`
*   `GET /search?query={q}&location={l}`
*   `GET /{id}`
*   `DELETE /{id}`
*   `POST /{id}/apply?userId={id}`
*   `GET /{id}/applications`

### Applications (`/api/applications`)
*   `GET ?userId={id}` (Seeker's applications)

### AI Services (`/api/ai`)
*   `POST /parse-resume/{userId}`
*   `GET /match-jobs/{userId}`

---

## 7. How to Run the Backend (Execution Guide)

To bring the backend online, both the Spring Boot server and the Python AI service must be running simultaneously.

**Step 1: Start the Database**
Ensure MySQL is running on port 3306 and a database named `hirotix_db` exists. Spring Boot (`application.properties`) will automatically generate the tables.

**Step 2: Start the Python AI Service**
```bash
cd ai-service
# Activate virtual environment (Windows)
.\venv\Scripts\activate
# Install dependencies if running for the first time
pip install -r requirements.txt
# Run the Flask app
python main.py
```
*(Runs on `http://localhost:5000`)*

**Step 3: Start the Spring Boot Application**
```bash
cd backend/hirotix-backend
# Run using Maven wrapper
.\mvnw spring-boot:run
```
*(Runs on `http://localhost:8080`)*

---

## 8. Alignment with Project Synopsis
This backend implementation directly addresses the core objectives outlined in the project synopsis:
*   **Resume-based AI Searching & Uploads:** Fully implemented via the Profile and AI-Bridge modules.
*   **Job Recommendations:** Fully implemented via the `/api/ai/match-jobs` endpoint.
*   **Role-based Platform:** Fully implemented (Seeker, Recruiter, Admin).
*   **Free and Open Source Technologies:** Handled using Python, Java, Spring Boot, MySQL, and Flask.

*Note: The Mock Interview system (noted as Optional in the synopsis) is intended as a frontend-driven AI API interaction (e.g., Google Gemini API) and does not require complex backend database states at this stage.*
