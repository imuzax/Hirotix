from flask import Flask, request, jsonify
import io
import re
from pdfminer.high_level import extract_text as extract_pdf_text

app = Flask(__name__)

@app.route("/", methods=["GET"])
def read_root():
    return jsonify({"message": "Hirotix AI Service (Flask) is running"})

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
        
        # Simple skill extraction logic using regex
        skills_keywords = ["java", "python", "spring", "react", "sql", "javascript", "node", "aws", "docker"]
        extracted_skills = []
        
        text_lower = text.lower()
        for skill in skills_keywords:
            if re.search(rf"\b{re.escape(skill)}\b", text_lower):
                extracted_skills.append(skill)
        
        return jsonify({
            "text": text,
            "skills": list(set(extracted_skills))
        })
    except Exception as e:
        return jsonify({"error": f"Error parsing PDF: {str(e)}"}), 500

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
        # Simple Jaccard similarity
        union_len = len(resume_words.union(job_words))
        score = len(overlap) / union_len if union_len > 0 else 0.0
        results.append({"score": round(score, 2)})
    
    return jsonify(results)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
