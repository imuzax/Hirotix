# Hirotix Technical Architecture

Hirotix is built on a modern, distributed architecture that leverages the strengths of multiple technologies to provide a high-performance, AI-driven recruitment experience.

## System Overview

The application follows a triple-tier architecture:
1.  **High-Fidelity Frontend**: Built with HTML5, CSS3, and modern JavaScript API consumers.
2.  **Robust Java Backend**: Spring Boot handles business logic, security, and data persistence with MySQL.
3.  **Intelligent AI Pipeline**: A dedicated Python Flask service powered by the Groq API (Llama 3.1) for resume parsing and real-time chat.

## Information Flow

```mermaid
graph TD
    User["User (Browser)"] -- HTTPS --> FE["Frontend (HTML/CSS/JS)"]
    FE -- JSON API / Multipart --> Java["Spring Boot Backend (Port 8080)"]
    Java -- SQL --> DB["MySQL Database (Port 3306)"]
    Java -- REST Proxy --> Python["AI Service (Python/Flask Port 5000)"]
    Python -- Streaming API --> Groq["Groq Cloud AI (Llama 3.1)"]
    
    subgraph "Logic & Persistence"
        Java
        DB
    end
    
    subgraph "Intelligence Layer"
        Python
        Groq
    end

    classDef default fill:#f9f9f9,stroke:#333,stroke-width:2px;
    classDef accent fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    class Java,Python,Groq accent;
```

## Communication Protocol
- **Cross-Origin Configuration**: Implemented via `CorsConfig.java` to allow secure communication between the frontend and distributed backend services.
- **Structured Data**: All inter-service communication utilizes DTOs (Data Transfer Objects) like `ChatRequest.java` to ensure type safety and schema consistency.
- **Asynchronous Processing**: Resume parsing results are asynchronously mapped to job descriptions for real-time AI scoring.
