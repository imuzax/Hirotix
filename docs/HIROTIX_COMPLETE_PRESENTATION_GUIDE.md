# 🚀 Hirotix - Complete Project Documentation & Presentation Guide

This document provides a comprehensive overview of the **Hirotix** platform, its architecture, technology stack, and core functionalities. It is designed to be used as a reference for project presentations and technical handovers.

---

## 💎 1. Project Vision & Overview
**Hirotix** is a premium, AI-powered recruitment ecosystem designed to modernize the hiring process. Instead of traditional static job boards, Hirotix uses real-time intelligence to bridge the gap between job seekers and recruiters.

- **Primary Goal**: To provide an automated, intelligent, and visually stunning platform for career growth and talent acquisition.
- **Key Philosophy**: "Intelligence with Aesthetics" – using Glassmorphism and modern UI trends alongside high-performance AI models.

---

## 🛠️ 2. The Technology Stack (Triple-Tier Architecture)

Hirotix is built using a distributed modular architecture, ensuring each component is optimized for its specific task.

### 🌐 Frontend (The Visual Experience)
- **Languages**: HTML5, CSS3, Vanilla JavaScript.
- **UI Design**: Modern **Glassmorphism** (frosted glass effects), animated gradients, and responsive layouts.
- **Key Modules**:
    - `index.html`: High-conversion landing page.
    - `seeker-dashboard.html`: Personalized user hub.
    - `mock-interview.html`: Real-time AI interview studio.
    - `resume-builder.html`: AI-integrated CV generator.
    - `admin/recruiter-dashboards`: Role-specific management panels.

### ☕ Backend (The Logic Engine)
- **Framework**: **Java Spring Boot**.
- **Architecture**: Spring MVC with RESTful Controllers.
- **Database**: **MySQL** for structured data (Users, Jobs, Profiles, Applications).
- **Core Components**:
    - `AIController`: Bridges the backend logic with the AI service.
    - `JobController`: Manages the lifecycle of job postings.
    - `AuthController`: Handles secure user registration and login.
    - `ProfileController`: Manages user/company data.

### 🤖 AI Brain (The Intelligence Layer)
- **Framework**: **Python Flask**.
- **LLM Provider**: **Groq API** (Lightning-fast inference).
- **Models Used**:
    - `Llama-3.3-70b-versatile`: For complex conversational intelligence.
    - `Llama-3.1-8b-instant`: For specialized tasks like resume parsing and question generation.
- **Core AI Features**:
    - **Resume Parsing**: Extracts technical skills from PDF/TXT files using NLP.
    - **Semantic Matching**: Scores candidates against job descriptions using weighted Jaccard similarity.
    - **Mock Interview Bot**: "Hiro" – A strict, sarcastic, and career-focused AI persona that simulates real-world stress.

---

## ✨ 3. Core Features & Functionalities

### 1. AI Resume Intelligence
Users can upload their resumes, and the AI automatically extracts key skills, experience, and certifications. This data is then used to suggest the best-fitting jobs.

### 2. AI Mock Interview Studio
A specialized environment where users practice for interviews. 
- **The "Hiro" Persona**: Unlike generic bots, "Hiro" is strictly job-focused. It shuts down off-topic talk with sarcasm, pushing the candidate to stay professional.
- **Dynamic Questions**: Generates 3-5 technical questions specific to the user's role and skill level.

### 3. Intelligent Job Matching
Recruiters don't have to manually filter hundreds of resumes. The system provides a **Match Score** based on how well the candidate's skills align with the requirements.

### 4. Admin & Recruiter Tools
- **Recruiters** can post jobs, track applications, and view AI-ranked candidates.
- **Admins** have oversight over the entire platform's activity and system health.

---

## 📐 4. System Intelligence Flow

1. **Input**: User uploads a resume or sends a chat message.
2. **Processing**: Java Backend validates the request and proxies it to the Python AI Service.
3. **Inference**: Python Service calls the Groq Cloud (Llama 3.1/3.3) with specialized system prompts.
4. **Contextual Enrichment**: The AI checks the database for available jobs or user history to provide "context-aware" answers.
5. **Output**: The user receives a high-speed AI response (under 1-2 seconds) delivered via a smooth UI.

---

## 🎯 5. Why Hirotix? (Unique Selling Points)

- **Speed**: Powered by Groq, the AI responses are near-instantaneous.
- **UI/UX**: The platform feels premium and world-class, moving away from boring enterprise designs.
- **Persona**: The "Strict Hiro" persona makes the mock interviews feel more "real" and less like a standard chatbot.
- **Zero Hallucination Strategy**: Use of strict system prompts prevents the AI from talking about non-career topics.

---

## 👨‍💻 6. Development Team
- **Muzaffar Hussain**: Full Stack Developer & AI Integration.
- **Sayyed Guftan**: Frontend Lead & UI/UX Designer.
- **Mentors**: Prof. Mahwish Momin & Prof. Affan Khan.

---
*Created for the Hirotix Final Project Presentation.*
