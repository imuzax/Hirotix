from flask import Flask, request, jsonify
from dotenv import load_dotenv
import io
import re
import os
import json
from pdfminer.high_level import extract_text as extract_pdf_text
from groq import Groq

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Initialize Groq Client
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "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")
client = Groq(api_key=GROQ_API_KEY)

# Strict System Prompt for Chatbot
CHATBOT_SYSTEM_PROMPT = """
You are Hiro, a highly intelligent, professional, and friendly AI Career Assistant for the Hirotix Job Portal.

**YOUR CORE OBJECTIVE:**
Assist users with job searches, career transitions, resume optimization, and mock interview practice.

**FORMATTING GUIDELINES (MANDATORY):**
- Use **Markdown** to make responses beautiful and easy to read.
- Use **Bold** for emphasis on key terms.
- Use **Bullet points** or **Numbered lists** for steps and recommendations.
- Use **Headings** (e.g., ### Section) to structure long responses.
- If providing a list of jobs or skills, use a table or neat bullets.

**BEHAVIORAL RULES:**
1. If a user asks anything UNRELATED to jobs, careers, or professional growth, politely decline and steer them back to Hirotix's purpose.
2. For greetings ("Hi", "Hello"), respond warmly: "Hello [User Name]! I'm Hiro, your career companion. I'm ready to help you land your dream job. What are we working on today?"
3. Keep the tone encouraging, professional, and efficient.
"""

@app.route("/", methods=["GET"])
def read_root():
    return jsonify({"message": "Hirotix Groq AI Service is running"})

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({"error": "Message is required"}), 400
        
    user_message = data['message']
    job_context = data.get('context', 'No specific job context provided.')
    history = data.get('history', []) # List of {"role": "user/assistant", "content": "..."}
    
    try:
        # Check if job_context is empty or just the default string
        is_context_empty = job_context == 'No specific job context provided.' or not job_context.strip()
        
        enriched_system_prompt = f"""
        {CHATBOT_SYSTEM_PROMPT}
        
        **CRITICAL DATA SOURCE RULES:**
        1. You are PROVIDED with a list of "AVAILABLE JOBS ON HIROTIX" below.
        2. **STRICT RULE:** You MUST ONLY suggest or talk about jobs found in the list below.
        3. **NO HALLUCinations:** Do NOT mention Google, Microsoft, Amazon, or any other company/job unless they are explicitly listed in the "AVAILABLE JOBS ON HIROTIX" section.
        4. If the list below is empty or if the user asks for jobs that aren't listed, you MUST say: "I couldn't find any jobs matching that description on Hirotix right now. However, I can help you prepare for your next opportunity!"
        5. If the user asks "What jobs are available?", only list the jobs from the context below. If context is empty, say "No jobs are currently posted on the Hirotix portal."

        **AVAILABLE JOBS ON HIROTIX:**
        {job_context if not is_context_empty else 'EMPTY: No jobs are currently in the database.'}
        
        **YOUR ADVANCED CAPABILITIES:**
        - Present matches from the list above in a clean Markdown table if possible.
        - Offer Deep Mock Interviews ONLY for jobs that exist in the list above.
        """
        
        messages = [{"role": "system", "content": enriched_system_prompt}]
        
        # Add history to the messages
        for msg in history:
            messages.append(msg)
            
        # Add current user message
        messages.append({"role": "user", "content": user_message})
        
        response = client.chat.completions.create(
            messages=messages,
            model="llama-3.1-8b-instant",
            temperature=0.1,
            max_tokens=1024
        )
        reply = response.choices[0].message.content
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"error": f"Groq API Error: {str(e)}"}), 500

@app.route("/mock-interview", methods=["POST"])
def mock_interview():
    data = request.get_json()
    if not data or 'job_title' not in data or 'skills' not in data:
        return jsonify({"error": "job_title and skills are required"}), 400
        
    job_title = data['job_title']
    skills = data['skills']
    
    prompt = f"""
    Act as an expert technical interviewer hiring for the role of '{job_title}'.
    The candidate has the following skills: {skills}.
    Generate exactly 3 relevant and challenging interview questions for this candidate.
    Return ONLY the questions, bulleted, with no extra conversation.
    """
    
    try:
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
        return jsonify({"error": f"Groq API Error: {str(e)}"}), 500

@app.route("/parse", methods=["POST"])
def parse_resume():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '' or not (file.filename.endswith(".pdf") or file.filename.endswith(".txt")):
        return jsonify({"error": "Only PDF or TXT files are supported"}), 400
    
    try:
        content = file.read()
        if file.filename.endswith(".pdf"):
            pdf_file = io.BytesIO(content)
            text = extract_pdf_text(pdf_file)
        else:
            text = content.decode('utf-8')
            
        # Limit text length to prevent breaking context windows unnecessarily
        text = text[:4000] 
        
        # Use Groq to extract skills
        extraction_prompt = f"""
        Extract the core technical and professional skills from the following resume text.
        Return ONLY a JSON array of strings containing the skills. No markdown formatting, no explanations.
        Example output format: ["Java", "Spring Boot", "React", "AWS"]
        
        Resume text:
        {text}
        """
        
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a precise data extraction API. Return valid JSON only."},
                {"role": "user", "content": extraction_prompt}
            ],
            model="llama-3.1-8b-instant",
            temperature=0.1,
            max_tokens=512
        )
        
        # Parse the JSON response
        skills_raw = response.choices[0].message.content.strip()
        
        # Clean up potential markdown formatting that the LLM might stubbornly include
        if skills_raw.startswith("```json"):
            skills_raw = skills_raw[7:-3]
        elif skills_raw.startswith("```"):
            skills_raw = skills_raw[3:-3]
            
        skills_raw = skills_raw.strip()
            
        try:
            extracted_skills = json.loads(skills_raw)
            if not isinstance(extracted_skills, list):
                extracted_skills = []
        except:
            # Fallback to Regex if Groq fails to return valid JSON
            skills_keywords = ["java", "python", "spring", "react", "sql", "javascript", "node", "aws", "docker"]
            extracted_skills = [skill for skill in skills_keywords if skill in text.lower()]
            
        return jsonify({
            "text": text,
            "skills": list(set(extracted_skills))
        })
    except Exception as e:
        return jsonify({"error": f"Error parsing mapping: {str(e)}"}), 500

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
        # Simple Jaccard similarity for speed. Can be upgraded to Groq scoring if needed.
        union_len = len(resume_words.union(job_words))
        score = len(overlap) / union_len if union_len > 0 else 0.0
        results.append({"score": round(score, 2)})
    
    return jsonify(results)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    print(f"🚀 Hirotix AI Service starting on port {port}...")
    app.run(host="0.0.0.0", port=port)
