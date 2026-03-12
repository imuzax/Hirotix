# 🚀 Hirotix Project Startup Guide

Follow these steps to run the complete project successfully. The system consists of three main components: MySQL Database, Java Backend, and Python AI Service.

---

## 1️⃣ STEP 1: Start MySQL Database
Ensure your MySQL server is running:
- Open **MySQL Workbench**, **XAMPP**, or your preferred database manager.
- Verify that the MySQL service is **Running** on the default port (**3306**).

---

## 2️⃣ STEP 2: Start Java Backend (Spring Boot)
- Open **IntelliJ IDEA**.
- Load the project located at `d:\Projects\College\Hirotix\backend\hirotix-backend`.
- Navigate to `src/main/java/com/hirotix/backend/HirotixBackendApplication.java`.
- Click the **Green Play Button (Run)**.
- Wait for the console to display: `"Started HirotixBackendApplication"`.

---

## 3️⃣ STEP 3: Start Python AI Service (Critical)
If this service is not running, the AI Chatbot and Resume Parsing will fail.
- Open a new **Terminal** (CMD, PowerShell, or Git Bash).
- Execute the following commands:

```powershell
# Navigate to the ai-service directory
cd d:\Projects\College\Hirotix\ai-service

# Install required dependencies (First-time setup)
pip install flask flask-cors pdfminer.six groq

# Start the AI Server
python main.py
```

- Once you see `"Running on http://127.0.0.1:5000"`, the AI service is active. **Keep this terminal window open** (you can minimize it).

---

## 4️⃣ STEP 4: Open the Frontend
- Open `index.html` in your web browser (or use the Live Server extension).
- Log in or register to use the AI-powered features!

---

---

## 🔐 Administrative Access
The system initializes a default administrator account on first startup:
- **Email**: `admin@hirotix.com`
- **Password**: `admin123`
- **Role**: Full System Access (ADMIN)

---

### 💡 Troubleshooting Tips:
- **Chatbot Error**: If you see "Sorry, trouble connecting...", verify that the Python terminal (Step 3) is still running.
- **Login Failure**: If login fails, ensure both MySQL (Step 1) and IntelliJ (Step 2) are running.
- **Port Conflict**: Ensure that no other applications are using Port **8080** (Java) or Port **5000** (Python).
