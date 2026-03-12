# Hirotix AI Intelligence Service

This service acts as the "Brain" of Hirotix, providing intelligent resume parsing, career guidance, and mock interview logic.

## 🚀 Technical Stack
- **Framework**: Flask (Python)
- **Model**: Llama-3.1-8b-instant (via Groq API)
- **Intelligence Layer**: Customized system prompts for persona-driven career advice.
- **Parsing**: PDFMiner for high-precision text extraction from CVs.

## 🧠 Core Features
1.  **Context-Aware Chat**: The service maintains a history buffer and uses specific job database context to prevent hallucinations.
2.  **Resume-to-Job Matching**: Algorithms to compare candidate profiles against real-time job listings using keyword overlap and semantic relevance.
3.  **Mock Interviews**: Dynamic generation of interview questions based on specific job roles and candidate skills.

## 🔌 API Endpoints
- `POST /chat`: Multi-turn conversational intelligence.
- `POST /parse`: Document extraction and structured parsing.
- `POST /match`: Semantic matching between profiles and opportunities.
- `POST /mock-interview`: Scenario-based interview generation.
