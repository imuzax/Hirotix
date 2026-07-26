import json
import urllib.request
import time

BASE_URL = "http://127.0.0.1:8080/api"

def make_request(endpoint, method="POST", data=None, params=None):
    url = f"{BASE_URL}{endpoint}"
    if params:
        query = "&".join([f"{k}={v}" for k, v in params.items()])
        url = f"{url}?{query}"
    
    headers = {"Content-Type": "application/json"}
    body = json.dumps(data).encode("utf-8") if data else None
    
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as res:
            return json.loads(res.read().decode("utf-8"))
    except Exception as e:
        print(f"Error calling {url}: {e}")
        return None

# 1. Register Recruiters (LinkedIn-style names)
recruiters_to_create = [
    {"fullName": "Google India (Cloud)", "email": "recruitment@google.com", "password": "pass123", "role": "RECRUITER"},
    {"fullName": "Microsoft R&D Pune", "email": "hire@microsoft.com", "password": "pass123", "role": "RECRUITER"},
    {"fullName": "TCS Digital", "email": "careers@tcs.com", "password": "pass123", "role": "RECRUITER"},
    {"fullName": "Infosys Power Program", "email": "jobs@infosys.com", "password": "pass123", "role": "RECRUITER"}
]

created_recruiters = []
for r in recruiters_to_create:
    # Try login first to see if exists, else register
    res = make_request("/auth/login", data={"email": r["email"], "password": r["password"]})
    if not res:
        res = make_request("/auth/register", data=r)
    
    if res:
        created_recruiters.append(res)
        print(f"Active Recruiter: {r['fullName']} (ID: {res['id']})")

# 2. Professional Jobs with Detailed Fields
jobs_to_create = [
    {
        "title": "Cloud Software Engineer (Java)",
        "company": "Google India (Cloud)",
        "location": "Pune, Maharashtra",
        "description": "Join our Google Cloud platform team in Pune. You'll work on building scalable microservices that power millions of users globally.",
        "responsibilities": "- Design and develop globally distributed cloud-native applications.\n- Collaborate with product managers to define feature specifications.\n- Maintain high standards for code quality and testing.\n- Optimize performance and latency for mission-critical services.",
        "requirements": "- Expertise in Java version 17+ and Spring Boot framework.\n- Basic understanding of Kubernetes and Docker.\n- Experience with SQL and NoSQL databases.\n- Strong problem-solving skills and data structures knowledge.",
        "qualifications": "BCA, MCA, B.Tech in Computer Science or equivalent technical field.",
        "salary": "₹15,00,000 - ₹25,00,000 LPA",
        "jobType": "FULL_TIME",
        "experienceLevel": "MID",
        "recruiter_idx": 0
    },
    {
        "title": "Full Stack Developer (MERN)",
        "company": "Microsoft R&D Pune",
        "location": "Amanora, Pune",
        "description": "We are seeking a Full Stack Developer to help build the next generation of productivity tools for the modern workspace.",
        "responsibilities": "- Implement frontend features using React.js and Redux.\n- Develop robust RESTful APIs using Node.js and Express.\n- Ensure cross-browser compatibility and application security.\n- Mentor junior developers and participate in code reviews.",
        "requirements": "- Minimum 3 years of experience in JavaScript/TypeScript.\n- Proficient in MongoDB and state management libraries.\n- Experience with Azure cloud services is a plus.\n- Familiarity with CI/CD pipelines.",
        "qualifications": "Bachelor's or Master's degree in CS, IT or Computer Applications.",
        "salary": "₹18,00,000 - ₹30,00,000 LPA",
        "jobType": "FULL_TIME",
        "experienceLevel": "MID",
        "recruiter_idx": 1
    },
    {
        "title": "AI/ML Associate Engineer",
        "company": "TCS Digital",
        "location": "Nagpur, Maharashtra",
        "description": "TCS Digital is hiring for AI/ML roles in our Nagpur Innovation Hub. Work on cutting-edge computer vision and NLP projects.",
        "responsibilities": "- Preprocess and clean data from diverse sources.\n- Train and evaluate machine learning models using Python.\n- Help integrate AI models into existing enterprise applications.\n- Research and implement state-of-the-art algorithms.",
        "requirements": "- Strong proficiency in Python and libraries like NumPy, Pandas, Scikit-learn.\n- Knowledge of TensorFlow or PyTorch.\n- Solid mathematical background in statistics and algebra.\n- Good communication skills for team collaboration.",
        "qualifications": "MCA or B.Tech (IT/CS) with specialization in Artificial Intelligence.",
        "salary": "₹7,00,000 - ₹12,00,000 LPA",
        "jobType": "FULL_TIME",
        "experienceLevel": "ENTRY",
        "recruiter_idx": 2
    },
    {
        "title": "Systems Analyst (BCA/MCA Special)",
        "company": "Infosys Power Program",
        "location": "Hinjewadi, Pune",
        "description": "Exclusive hiring for freshers from top BCA/MCA colleges. Fast-track your career in systems analysis and design.",
        "responsibilities": "- Gather business requirements and transform them into technical designs.\n- Support testing teams during UAT phases.\n- Document system workflows and user manuals.\n- Manage small-to-medium project timelines.",
        "requirements": "- Logical thinking and analytical mindset.\n- Strong understanding of Database Management Systems (DBMS).\n- Basics of Software Development Life Cycle (SDLC).\n- Proficiency in MS Office and flowcharting tools.",
        "qualifications": "Fresh BCA or MCA graduates with 65%+ throughout academics.",
        "salary": "₹4,50,000 - ₹6,50,000 LPA",
        "jobType": "FULL_TIME",
        "experienceLevel": "ENTRY",
        "recruiter_idx": 3
    }
]

# Post the jobs
for job in jobs_to_create:
    idx = job.pop("recruiter_idx")
    if idx < len(created_recruiters):
        recruiter_id = created_recruiters[idx]["id"]
        res = make_request("/jobs", data=job, params={"recruiterId": recruiter_id})
        if res:
            print(f"Posted: {job['title']} @ {job['company']}")

print("\n--- PROFESSIONAL SEEDING COMPLETE ---")
