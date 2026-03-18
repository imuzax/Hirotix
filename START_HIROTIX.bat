@echo off
TITLE Hirotix Unified Startup
COLOR 0B

echo =======================================================
echo           HIROTIX - AI POWERED JOB PORTAL
echo                Unified Startup Logic
echo =======================================================
echo.

:: 1. Check MySQL
echo [1/3] Checking MySQL Database...
netstat -ano | findstr :3306 > nul
if %errorlevel% equ 0 (
    echo [OK] MySQL is active on port 3306.
) else (
    echo [ERROR] MySQL is NOT running! Please start XAMPP or MySQL Service.
    pause
    exit /b
)

:: 2. Check Groq API Key
echo [2/4] Checking AI Service Configuration...
set ENV_FILE=%~dp0ai-service\.env
if not exist "%ENV_FILE%" (
    echo [ERROR] .env file NOT found! Creating default...
    copy nul "%ENV_FILE%" > nul
)
findstr /C:"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" "%ENV_FILE%" > nul
if %errorlevel% equ 0 (
    echo.
    echo [WARNING] Default API Key detected! AI might not work during presentation.
    echo [INFO] Please follow 'ai-service\API_KEY_GUIDE.txt' to set your own key.
    echo.
)

:: 3. Start Python AI Service
echo [3/4] Starting Python AI Service (Port 5000)...
start "Hirotix AI Service" cmd /c "cd /d %~dp0ai-service && venv\Scripts\python.exe main.py"
timeout /t 3 > nul

:: 4. Start Java Backend
echo [4/4] Checking Java Environment...
echo [INFO] Please ensure IntelliJ IDEA is running the backend.
echo [INFO] Alternatively, type 'Y' to attempt starting with Maven Wrapper:
set /p choice="Start via Maven? (y/n): "
if /i "%choice%"=="y" (
    echo Starting Java Backend...
    cd /d %~dp0backend\hirotix-backend
    start "Hirotix Java Backend" cmd /c "mvnw spring-boot:run"
)

echo.
echo =======================================================
echo       ALL SERVICES ARE INITIALIZING!
echo    URL: http://127.0.0.1:5500/frontend/index.html
echo =======================================================
echo.
pause
