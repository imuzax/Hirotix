import time
import os
import logging
from flask import Blueprint, jsonify, request
from app.services.llm_service import llm_service
from app.services.resume_service import resume_service

logger = logging.getLogger('hirotix-ai')

bp = Blueprint('api', __name__)
start_time = time.time()

@bp.route("/health", methods=["GET"])
def health():
    status = "healthy"
    try:
        llm_service.get_client()
    except Exception as e:
        status = f"unhealthy: {str(e)}"
    
    return jsonify({
        "status": status,
        "api_key_set": bool(os.getenv("GROQ_API_KEY")),
        "uptime": time.time() - start_time,
        "service": "Hirotix AI Engine"
    })

@bp.route("/", methods=["GET"])
def read_root():
    return jsonify({"message": "Hirotix Groq AI Service is active", "version": "2.0.0-modular"})

@bp.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({"error": "Message is required"}), 400
        
    user_message = data['message']
    job_context = data.get('context', '')
    history = data.get('history', []) 
    
    logger.info(f"Chat request received: {user_message[:50]}...")
    
    try:
        reply = llm_service.chat_completion(user_message, job_context, history)
        return jsonify({"reply": reply})
    except Exception as e:
        logger.error(f"Groq Chat Error: {str(e)}")
        return jsonify({"error": f"AI Engine Error: {str(e)}"}), 500

@bp.route("/mock-interview", methods=["POST"])
def mock_interview():
    data = request.get_json()
    if not data or 'job_title' not in data or 'skills' not in data:
        return jsonify({"error": "job_title and skills are required"}), 400
        
    job_title = data['job_title']
    skills = data['skills']
    
    try:
        questions = llm_service.generate_interview_questions(job_title, skills)
        return jsonify({"questions": questions})
    except Exception as e:
        logger.error(f"Groq Interview Error: {str(e)}")
        return jsonify({"error": f"AI Engine Error: {str(e)}"}), 500

@bp.route("/parse", methods=["POST"])
def parse_resume():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '' or not (file.filename.endswith(".pdf") or file.filename.endswith(".txt")):
        return jsonify({"error": "Only PDF or TXT files are supported"}), 400
    
    try:
        content = file.read()
        result = resume_service.parse_resume(file.filename, content)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Groq Parse Error: {str(e)}")
        return jsonify({"error": "Failed to parse resume"}), 500

@bp.route("/match", methods=["POST"])
def match_jobs():
    data = request.get_json()
    if not data or 'resume_text' not in data or 'job_descriptions' not in data:
        return jsonify({"error": "Invalid request body"}), 400
        
    resume_text = data['resume_text']
    job_descriptions = data['job_descriptions']
    
    results = resume_service.match_jobs(resume_text, job_descriptions)
    return jsonify(results)
