# Hirotix AI Job Portal - UML & System Diagrams

This document contains the visual representation of the final architecture and UML diagrams for the **Hirotix Intelligent AI-Powered Job Portal** as per the guide's requirements.

> **Note to user:** These diagrams are generated using Mermaid.js. In standard markdown viewers (like GitHub, VS Code, or Typora), these code blocks will automatically render into proper visual diagrams. 

---

## 1. System Flow Diagram
This shows how data flows between the user and the system's core components: the Frontend, Backend, AI Engine, and the Database.

```mermaid
flowchart TD
    User([User: Seeker/Recruiter]) -->|Interacts via Browser| Frontend[Web App Frontend]
    Frontend -->|HTTP REST Calls| Backend[Spring Boot Backend]
    Backend <-->|Read/Write Data| DB[(MySQL Database)]
    Backend <-->|Send Resume/Query| AIService[Python AI Engine]
    AIService -. "Calculates Match Score & Parses PDF" .-> Backend
    Backend -->|Return JSON| Frontend
```

---

## 2. Object Diagram
An object diagram shows a specific snapshot of the system at runtime, demonstrating how objects relate to each other.

```mermaid
classDiagram
    class `Seeker1: User` {
        id = 101
        fullName = "Rahul Sharma"
        role = "SEEKER"
    }
    class `RahulProfile: Profile` {
        id = 501
        skills = "Java, Spring Boot"
        location = "Pune"
    }
    class `Recruiter1: User` {
        id = 201
        fullName = "TCS HR"
        role = "RECRUITER"
    }
    class `JavaJob: Job` {
        id = 901
        title = "Backend Developer"
        salary = "12 LPA"
    }
    class `App1: Application` {
        id = 3001
        status = "SHORTLISTED"
    }

    `Seeker1: User` -- `RahulProfile: Profile` : owns
    `Recruiter1: User` -- `JavaJob: Job` : posts
    `Seeker1: User` -- `App1: Application` : submits
    `App1: Application` -- `JavaJob: Job` : applied for
```

---

## 3. Class Diagram
This represents the static structure of the database entities and the core backend models.

```mermaid
classDiagram
    class User {
        +Long id
        +String fullName
        +String email
        +String password
        +Role role
        +register()
        +login()
    }
    class Profile {
        +Long id
        +String skills
        +String education
        +String experience
        +String location
        +String resumePath
        +updateProfile()
    }
    class Job {
        +Long id
        +String title
        +String company
        +String description
        +String salary
        +Enum jobType
        +Enum experienceLevel
        +LocalDateTime postedDate
    }
    class Application {
        +Long id
        +Enum status
        +LocalDateTime appliedDate
        +changeStatus()
    }

    User "1" --> "1" Profile : has
    User "1" --> "*" Job : posts (Recruiter)
    User "1" --> "*" Application : makes (Seeker)
    Job "1" --> "*" Application : receives
```

---

## 4. Use Case Diagram
This illustrates the actors (users interacting with the system) and the actions they can perform.

```mermaid
flowchart LR
    subgraph Users
        S[Job Seeker]
        R[Recruiter]
        A[Admin]
    end

    subgraph System Functions
        Reg[Register / Login]
        P[Manage Profile & Resume]
        J[Search & Apply Jobs]
        PJ[Post & Manage Jobs]
        VA[View Applicants]
        AI[AI Job Recommendation]
        UM[Manage All Users]
    end

    S --> Reg
    R --> Reg
    A --> Reg

    S --> P
    S --> J
    S --> AI

    R --> PJ
    R --> VA

    A --> UM
```

---

## 5. Sequence Diagram
This tracks the chronological sequence of interactions when a Job Seeker applies for an AI-Recommended job.

```mermaid
sequenceDiagram
    actor Seeker
    participant UI as Frontend
    participant API as Spring Boot App
    participant AI as Python AI Service
    participant DB as Database

    Seeker->>UI: View Job Recommendations
    UI->>API: GET /api/jobs/recommend (token)
    API->>DB: Fetch Applicant Profile
    API->>AI: Send Profile Skills & Job Data
    AI-->>API: Return Match Percentages
    API-->>UI: Return Recommended Jobs List
    UI-->>Seeker: Display Jobs
    
    Seeker->>UI: Click "Apply"
    UI->>API: POST /api/applications/{jobId}
    API->>DB: Save Application Status (APPLIED)
    DB-->>API: Confirmed
    API-->>UI: Success 200 OK
    UI-->>Seeker: "Application Submitted!"
```

---

## 6. Activity Diagram
This shows the step-by-step workflow (logic flow) of the AI Resume Parsing component.

```mermaid
stateDiagram-v2
    [*] --> UploadResume
    UploadResume --> StorePDF: User uploads file
    StorePDF --> SendToAI: Backend reads path
    SendToAI --> NLP_Processing: AI Service extracts text
    
    state NLP_Processing {
        [*] --> EntityExtraction
        EntityExtraction --> FindSkills
        FindSkills --> FindExperience
    }
    
    NLP_Processing --> SaveToDB: Return JSON Object
    SaveToDB --> ShowParsedData: Update User Profile
    ShowParsedData --> [*]: Seeker verifies data
```

---

## 7. Deployment Diagram
This maps out the physical architecture of where the software will be hosted and executed in a production environment.

```mermaid
flowchart TD
    subgraph "Client Tier"
        Browser[Web Browser / Mobile]
    end

    subgraph "Web/App Server (EC2 / Localhost:8080)"
        Node[(React.js / Frontend Assets)]
        Spring[Spring Boot REST APIs]
    end

    subgraph "AI Microservice (Localhost:8000)"
        Python[FastAPI / Flask Engine]
        Model((NLP ML Model))
    end

    subgraph "Database Server (Localhost:3306)"
        MySQL[(MySQL Database)]
    end

    Browser ---|HTTP / HTTPS| Node
    Browser ---|REST API Calls| Spring
    Spring ---|JDBC / TCP| MySQL
    Spring ---|Internal HTTP| Python
    Python --- Model
```

---

## 8. Website Map Diagram
This illustrates the hierarchical navigation and structure of the application's user interface.

```mermaid
flowchart TD
    Home[Homepage / Landing] --> Auth[Login / Register]
    Home --> About[About Us]

    Auth --> SeekerDash[Seeker Dashboard]
    Auth --> RecruiterDash[Recruiter Dashboard]
    Auth --> AdminDash[Admin Panel]

    SeekerDash --> Profile[My Profile & Resume]
    SeekerDash --> JobSearch[Search Jobs]
    SeekerDash --> Recommendations[AI Recommended Jobs]
    SeekerDash --> ApplicationHistory[My Applications]

    RecruiterDash --> PostJob[Post a New Job]
    RecruiterDash --> ManageJobs[My Posted Jobs]
    RecruiterDash --> ApplicantsList[View Applicants]

    AdminDash --> ManageUsers[Manage Users]
    AdminDash --> SystemLogs[System Logs]
```
