# HIROTIX: AI-Driven Career Hub & Synergy Engine

## 1. Project Overview
**Hirotix** is a next-generation job portal designed to bridge the gap between students, mentors, and employers using artificial intelligence. Unlike traditional job boards, Hirotix focuses on **active mentorship** and **intelligent career guidance** through its unique "Synergy Hub" architecture.

### 🎯 Core Objective
To provide a unified ecosystem where career seekers can build AI-optimized resumes, practice for interviews with a specialized "Hiro AI", and visualize their technical growth through direct mentorship pairings.

---

## 2. Key Features

### 🧠 2.1 Hiro AI Intelligence Suite
*   **Context-Aware Chat**: A multi-turn AI assistant ("Hiro") that integrates directly with the Hirotix job database to provide real-time career advice.
*   **AI Resume Builder**: Automated extraction of skills from PDF/TXT resumes using the Llama-3.1 model.
*   **Mock Interview Studio**: Generates dynamic technical interview questions based on the user's specific skills and target job roles.

### 🤝 2.2 Technical Synergy Pairs (Student-Mentor Network)
*   **Direct Mentorship Visualization**: A specialized UI that connects students to their specific guides via "Synergy Bridges."
*   **Partner-Based Tracking**: Moves away from generic card layouts to a connected network structure, representing real-time collaboration.

### 📊 2.3 Administration & Management
*   **Seeker & Recruiter Dashboards**: Tailored interfaces for tracking applications and job postings.
*   **Admin Control Panel**: Advanced management of users, system health, and recruitment statistics.

---

## 3. Technology Stack

### 💻 Frontend
*   **Core**: HTML5, Semantic HTML, JavaScript (ES6+)
*   **Aesthetics**: Vanilla CSS3 (Modern Glassmorphism, Dynamic Transitions, Responsive Grid)
*   **Icons**: Ionicons

### ⚙️ Backend (Java Hub)
*   **Framework**: Spring Boot 3.x
*   **Database**: MySQL (Relational Persistence)
*   **Architecture**: RESTful API Design, JPA/Hibernate

### 🤖 AI Engine (Python Brain)
*   **Framework**: Flask (Python 3.x)
*   **Core Logic**: Groq API (Llama-3.1-8b-instant)
*   **Intelligence Layer**: Persona-driven system prompting for career guidance.
*   **Document Analysis**: PDFMiner for resume text extraction.

---

## 4. System Architecture
1.  **Client Layer**: Browser-based responsive UI interactting with Java REST endpoints.
2.  **Service Layer**: Spring Boot handles business logic, security, and database ORM.
3.  **Intelligence Layer**: A standalone Python service provides high-level AI capabilities, keeping the core platform lightweight and modular.
4.  **Data Layer**: MySQL stores profiles, jobs, applications, and synergy pairings.

---

## 5. Unique Selling Points (USP)
*   **Unified Startup**: Orchestrated via `START_HIROTIX.bat` for seamless multi-service execution.
*   **Zero-Box Design**: A premium, minimalist aesthetic focused on connectivity rather than traditional containers.
*   **Fiber-Optic Visuals**: Subtle animations representing data flow between nodes and mentors.

---

## 6. Future Enhancements
*   **Full Gemini AI Integration**: Upgrading the intelligence layer to Google Gemini 1.5 for higher rate limits and deeper reasoning.
*   **Real-time Collaboration**: WebSocket integration for instant messaging between student-mentor pairs.
*   **Video Interview Analysis**: AI-driven facial expression and sentiment analysis during mock interviews.
