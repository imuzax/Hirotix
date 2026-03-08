# AI Integration & API Details 
**Project: Intelligent AI-Powered Job Portal**

This document provides a detailed technical breakdown of how Artificial Intelligence (AI) has been integrated into the backend of this project. It is intended for project guides and technical reviewers to understand the workflow, tools used, and the specific APIs developed.

---

## 1. AI Technology Used
To fulfill the requirement of an "Intelligent" platform, we have integrated the **Groq API** (using the `llama-3.1-8b-instant` Large Language Model). 

**Why Groq?** 
Groq provides ultra-fast inference for Open-Source LLMs, allowing our platform to analyze resumes, generate interview questions, and chat with users in real-time without causing delays in the Spring Boot backend.

---

## 2. Architecture & Workflow

The architecture separates the core database logic from the AI processing to ensure scalability.

**The Flow:**
1. **Frontend/User:** Sends a request to the Java Spring Boot Backend (e.g., Uploads a Resume or sends a Chat message).
2. **Java Spring Boot (`src/main/java/.../AIService.java`):** Acts as the central controller. It receives the request and forwards the raw data (text or PDF file) to the Python AI Microservice via REST API.
3. **Python Flask Service (`ai-service/main.py`):** 
   - Receives the data from Spring Boot.
   - Connects to the **Groq Cloud API** using our secure API key.
   - Formats the data with specific "System Prompts" (Instructions for the AI).
   - Receives the intelligent response from Groq.
   - Cleans the response (e.g., formats it into JSON) and sends it back to Spring Boot.
4. **Java Spring Boot:** Receives the clean AI data, saves it to the MySQL database (if needed, like saving extracted skills), and returns the final result to the Frontend.

---

## 3. Implemented AI Features & Endpoints

The AI Service provides 4 major intelligent features. Here is how they work internally:

### Feature A: Intelligent Chatbot (`/api/chat`)
- **What it does:** A side-widget chatbot (named "Hiro") that helps users navigate their career.
- **How it works:** The Python service uses a *Strict System Prompt* that restricts the Groq LLM. It is strictly instructed to **only** answer questions related to jobs, interviews, and resumes. If a user asks an out-of-scope question (e.g., "Give me a recipe" or "What is today's news"), the AI politely rejects the prompt, maintaining a professional platform environment.
- **Spring Boot Endpoint:** `POST http://localhost:8080/api/chat`
  - *Payload:* `{"message": "How do I prepare for a Java developer interview?"}`

### Feature B: AI Mock Interview Generator (`/api/ai/mock-interview/{userId}/{jobId}`)
- **What it does:** Generates customized Technical Interview questions.
- **How it works:** When a user clicks "Start Mock Interview" on a specific job, Spring Boot fetches the **User's Skills** from the database and the **Job Title**. It sends both to Groq. Groq then generates 3 highly specific, challenging questions tailored *exactly* to what that candidate needs to know for that specific job posting.
- **Spring Boot Endpoint:** `GET http://localhost:8080/api/ai/mock-interview/{userId}/{jobId}`

### Feature C: Advanced Resume Parsing (`/api/ai/parse-resume/{userId}`)
- **What it does:** Replaces manual data entry by extracting skills directly from uploaded PDFs.
- **How it works:** When a PDF is uploaded, Python extracts all raw text using `pdfminer.six`. Instead of just searching for keywords, the entire text is sent to Groq. The LLM "reads" the resume contextually and returns a clean JSON array of technical skills (e.g., `["Java", "Spring Boot", "MySQL"]`).
- **Spring Boot Endpoint:** `POST http://localhost:8080/api/ai/parse-resume/{userId}`

### Feature D: Job Recommendation & Matching (`/api/ai/match-jobs/{userId}`)
- **What it does:** Suggests the best jobs for a candidate automatically.
- **How it works:** Spring Boot sends the candidate's extracted skills and all active Job Descriptions to Python. Python calculates the mathematical intersection (Jaccard Similarity) between the candidate's skills and the requirements of each job, ranking them by a percentage score.
- **Spring Boot Endpoint:** `GET http://localhost:8080/api/ai/match-jobs/{userId}`

---

## 4. Where to Find the Code in the Project folder

If the Project Guide wishes to review the AI code, please direct them to these specific files:

1. **The Core AI Logic (Python):** 
   - `Hirotix/ai-service/main.py` -> Look here for the Groq API implementation, the strict Chatbot System Prompt, and the Mock Interview logic.
2. **The Spring Boot AI Client (Java):** 
   - `Hirotix/backend/hirotix-backend/src/main/java/.../service/AIService.java` -> Look here to see how Java communicates with Python.
3. **The API Controllers (Java):** 
   - `Hirotix/backend/hirotix-backend/src/main/java/.../controller/AIController.java` (For Parsing and Matching)
   - `Hirotix/backend/hirotix-backend/src/main/java/.../controller/ChatController.java` (For the Chatbot)
