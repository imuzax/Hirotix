import io
import re
import json
import logging
from pdfminer.high_level import extract_text as extract_pdf_text
from app.services.llm_service import llm_service

logger = logging.getLogger('hirotix-ai')

class ResumeService:
    def parse_resume(self, filename: str, content: bytes) -> dict:
        if filename.endswith(".pdf"):
            pdf_file = io.BytesIO(content)
            text = extract_pdf_text(pdf_file)
        else:
            text = content.decode('utf-8')
            
        text = text[:4000] # Limit tokens
        
        extraction_prompt = f"""
        Extract core skills from resume text. Return ONLY a JSON array.
        Resume: {text}
        """
        
        client = llm_service.get_client()
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
        except Exception as e:
            logger.error(f"Failed to parse skills JSON: {e}")
            extracted_skills = ["Manual Review Required"]
            
        return {
            "text": text,
            "skills": extracted_skills
        }

    def match_jobs(self, resume_text: str, job_descriptions: list) -> list:
        # Improved algorithm: removing common stop words for better TF/IDF style matching
        stop_words = {'and', 'or', 'the', 'is', 'in', 'to', 'with', 'for', 'a', 'of', 'on'}
        
        results = []
        raw_resume_words = set(re.findall(r'\w+', resume_text.lower()))
        resume_words = raw_resume_words - stop_words
        
        for job_desc in job_descriptions:
            raw_job_words = set(re.findall(r'\w+', job_desc.lower()))
            job_words = raw_job_words - stop_words
            
            if not job_words:
                results.append({"score": 0.0})
                continue
                
            overlap = resume_words.intersection(job_words)
            union_len = len(resume_words.union(job_words))
            score = len(overlap) / union_len if union_len > 0 else 0.0
            results.append({"score": round(score, 2)})
            
        return results

resume_service = ResumeService()
