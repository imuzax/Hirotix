import logging
from logging.handlers import RotatingFileHandler

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('hirotix-ai')
handler = RotatingFileHandler('ai_service.log', maxBytes=1000000, backupCount=3)
handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
logger.addHandler(handler)

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import io
import re
import os
import json
import time
from pdfminer.high_level import extract_text as extract_pdf_text
from groq import Groq

# Load environment variables
basedir = os.path.abspath(os.path.dirname(__file__))
env_path = os.path.join(basedir, '.env')
load_dotenv(env_path, override=True)

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# Lazy initialization of Groq Client
_client = None

def get_groq_client():
    global _client
    if _client is None:
        api_key = os.getenv("GROQ_API_KEY", "").strip()
        logger.info(f"Initializing Groq Client with key starting: {api_key[:8]}...")
        _client = Groq(api_key=api_key)
    return _client

# Strict System Prompt for Chatbot
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

@app.route("/health", methods=["GET"])
def health():
    status = "healthy"
    try:
        # Quick test of the client
        get_groq_client()
    except Exception as e:
        status = f"unhealthy: {str(e)}"
    
    return jsonify({
        "status": status,
        "api_key_set": bool(os.getenv("GROQ_API_KEY")),
        "uptime": time.time() - start_time,
        "service": "Hirotix AI Engine"
    })

@app.route("/", methods=["GET"])
def read_root():
    return jsonify({"message": "Hirotix Groq AI Service is active", "version": "1.1.0-stable"})

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({"error": "Message is required"}), 400
        
    user_message = data['message'].lower()
    job_context = data.get('context', '')
    history = data.get('history', []) 
    
    logger.info(f"Chat request received: {user_message[:50]}...")
    
    # TOKEN SAVING & STRICT LOGIC: Only include job context if user explicitly asks for job lists or roles
    job_list_keywords = ['show jobs', 'list jobs', 'available jobs', 'vacancies', 'opening', 'what jobs', 'role', 'position', 'career', 'hiring', 'any']
    is_job_request = any(kw in user_message for kw in job_list_keywords)
    
    try:
        client = get_groq_client()
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
        messages.append({"role": "user", "content": data['message']})
        
        response = client.chat.completions.create(
            messages=messages,
            model="llama-3.3-70b-versatile",
            temperature=0.2, 
            max_tokens=400   
        )
        reply = response.choices[0].message.content
        return jsonify({"reply": reply})
    except Exception as e:
        logger.error(f"Groq Chat Error: {str(e)}")
        return jsonify({"error": f"AI Engine Error: {str(e)}"}), 500

@app.route("/mock-interview", methods=["POST"])
def mock_interview():
    data = request.get_json()
    if not data or 'job_title' not in data or 'skills' not in data:
        return jsonify({"error": "job_title and skills are required"}), 400
        
    job_title = data['job_title']
    skills = data['skills']
    
    try:
        client = get_groq_client()
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
        questions = response.choices[0].message.content
        return jsonify({"questions": questions})
    except Exception as e:
        logger.error(f"Groq Interview Error: {str(e)}")
        return jsonify({"error": f"AI Engine Error: {str(e)}"}), 500

@app.route("/parse", methods=["POST"])
def parse_resume():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '' or not (file.filename.endswith(".pdf") or file.filename.endswith(".txt")):
        return jsonify({"error": "Only PDF or TXT files are supported"}), 400
    
    try:
        client = get_groq_client()
        content = file.read()
        if file.filename.endswith(".pdf"):
            pdf_file = io.BytesIO(content)
            text = extract_pdf_text(pdf_file)
        else:
            text = content.decode('utf-8')
            
        text = text[:4000] 
        
        extraction_prompt = f"""
        Extract core skills from resume text. Return ONLY a JSON array.
        Resume: {text}
        """
        
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "Return valid JSON array only."},
                {"role": "user", "content": extraction_prompt}
            ],
            model="llama-3.1-8b-instant",
            temperature=0.1,
            max_tokens=512
        )
        
        skills_raw = response.choices[0].message.content.strip()
        if "```json" in skills_raw:
            skills_raw = skills_raw.split("```json")[1].split("```")[0].strip()
            
        try:
            extracted_skills = json.loads(skills_raw)
        except:
            extracted_skills = ["Manual Review Required"]
            
        return jsonify({
            "text": text,
            "skills": extracted_skills
        })
    except Exception as e:
        logger.error(f"Groq Parse Error: {str(e)}")
        return jsonify({"error": "Failed to parse resume"}), 500

@app.route("/match", methods=["POST"])
def match_jobs():
    data = request.get_json()
    if not data or 'resume_text' not in data or 'job_descriptions' not in data:
        return jsonify({"error": "Invalid request body"}), 400
        
    resume_text = data['resume_text']
    job_descriptions = data['job_descriptions']
    
    results = []
    resume_words = set(re.findall(r'\w+', resume_text.lower()))
    
    for job_desc in job_descriptions:
        job_words = set(re.findall(r'\w+', job_desc.lower()))
        if not job_words:
            results.append({"score": 0.0})
            continue
            
        overlap = resume_words.intersection(job_words)
        union_len = len(resume_words.union(job_words))
        score = len(overlap) / union_len if union_len > 0 else 0.0
        results.append({"score": round(score, 2)})
    
    return jsonify(results)

if __name__ == "__main__":
    start_time = time.time()
    port = int(os.getenv("PORT", 5000))
    logger.info(f"Hirotix AI Service starting on port {port} with Threaded mode.")
    # Threaded=True prevents single hanging requests from blocking the server
    app.run(host="0.0.0.0", port=port, debug=False, threaded=True)
