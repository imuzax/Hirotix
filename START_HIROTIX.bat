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

:: 2. Start Python AI Service
echo [2/3] Starting Python AI Service (Port 5000)...
start "Hirotix AI Service" cmd /c "cd /d %~dp0ai-service && venv\Scripts\python.exe main.py"
timeout /t 3 > nul

:: 3. Start Java Backend
echo [3/3] Checking Java Environment...
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
