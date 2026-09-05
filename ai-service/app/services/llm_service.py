import os
import logging
from groq import Groq

logger = logging.getLogger('hirotix-ai')

CHATBOT_SYSTEM_PROMPT = """
You are Hiro, the **Extremely Strict and No-Nonsense** AI Career Assistant for Hirotix.

**YOUR PERSONA (STRICT RULES):**
- You ONLY talk about jobs, resumes, and interviews.
- **DATABASE ONLY**: You are prohibited from mentioning external companies (IBM, Google, Amazon, etc.) unless they are explicitly listed in the "DATABASE CONTEXT" below.
- If a user asks about a job or company NOT in your database, say: "I couldn't find that role in the Hirotix job database. Check back later or look for available openings here!"
- If the user asks ANYTHING else (How are you, movies, travel, food, weather, etc.), you must be **sarcastic and very short**.
- Example: "I'm not your travel agent. Go to MakeMyTrip. Here we talk about Jobs only. Kuch kaam dhanda dhundo!"
- Tone: Strict, Sarcastic, Professional (Hiring Manager style).

**CORE DATA RULES:**
1. Only show jobs if explicitly asked (e.g., "show me jobs", "list vacancies").
2. **DO NOT** respond with a table of jobs by default for every career question. 
3. If the user is just chatting or asking off-topic, **DO NOT** show the "Available Jobs" section.

**FORMATTING:**
- Use **Markdown** (bold, bullets).
- **CONCISE ONLY.** Do not write more than 2-3 sentences for off-topic queries.
"""

class LLMService:
    def __init__(self):
        self._client = None

    def get_client(self) -> Groq:
        if self._client is None:
            api_key = os.getenv("GROQ_API_KEY", "").strip()
            logger.info(f"Initializing Groq Client with key starting: {api_key[:8]}...")
            self._client = Groq(api_key=api_key)
        return self._client

    def chat_completion(self, user_message: str, job_context: str, history: list) -> str:
        client = self.get_client()
        
        job_list_keywords = ['show jobs', 'list jobs', 'available jobs', 'vacancies', 'opening', 'what jobs', 'role', 'position', 'career', 'hiring', 'any']
        is_job_request = any(kw in user_message.lower() for kw in job_list_keywords)
        
        final_context = "USER DID NOT ASK FOR JOBS. DO NOT SHOW ANY JOB LISTINGS OR TABLES."
        if is_job_request and job_context.strip():
            final_context = f"AVAILABLE JOBS:\n{job_context}"
            
        enriched_system_prompt = f"""
        {CHATBOT_SYSTEM_PROMPT}
        
        **DATABASE CONTEXT:**
        {final_context}
        """
        
        messages = [{"role": "system", "content": enriched_system_prompt}]
        for msg in history:
            messages.append(msg)
        messages.append({"role": "user", "content": user_message})
        
        response = client.chat.completions.create(
            messages=messages,
            model="llama-3.3-70b-versatile",
            temperature=0.2, 
            max_tokens=400   
        )
        return response.choices[0].message.content

    def generate_interview_questions(self, job_title: str, skills: list) -> str:
        client = self.get_client()
        prompt = f"""
        Act as an expert technical interviewer hiring for the role of '{job_title}'.
        The candidate has the following skills: {skills}.
        Generate exactly 3 relevant and challenging interview questions for this candidate.
        Return ONLY the questions, bulleted, with no extra conversation.
        """
        
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a serious corporate technical interviewer."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.1-8b-instant",
            temperature=0.7,
            max_tokens=512
        )
        return response.choices[0].message.content

llm_service = LLMService()
