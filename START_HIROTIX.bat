@echo off
TITLE Hirotix AI Service Activator
COLOR 0B

echo =======================================================
echo          HIROTIX - AI ENGINE ACTIVATOR
echo =======================================================
echo.

:: 0. Clean Existing Processes
echo [1/2] Cleaning old AI processes on Port 5000...
taskkill /f /im python.exe /t 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do taskkill /f /pid %%a 2>nul
timeout /t 2 > nul
echo [OK] Port 5000 is clean.

:: 1. Start Python AI Service
echo [2/2] Starting Hirotix AI Engine...
cd /d %~dp0ai-service
start "Hirotix AI Engine" cmd /k "venv\Scripts\python.exe main.py"

echo.
echo [WAIT] Waiting for AI to wake up...
:search
timeout /t 2 > nul
netstat -ano | findstr :5000 > nul
if %errorlevel% equ 0 (
    echo.
    echo =======================================================
    echo          SUCCESS: HIROTIX AI IS ONLINE!
    echo =======================================================
    echo.
    echo  1. Keep THIS window open.
    echo  2. Ensure IntelliJ is running the Backend.
    echo  3. Refresh your browser (Live Server).
    echo.
    pause
    exit
) else (
    echo [WAIT] Initializing...
    goto search
)
