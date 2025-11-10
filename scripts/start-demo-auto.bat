@echo off
REM Script tự động start Next.js và ngrok
REM Usage: scripts\start-demo-auto.bat

echo ========================================
echo   STARTING DEMO (Next.js + Ngrok)
echo ========================================
echo.

REM Check if ngrok is installed
where ngrok >nul 2>&1
if errorlevel 1 (
    echo [ERROR] ngrok not found!
    echo [TIP] Install ngrok: npm install -g ngrok
    pause
    exit /b 1
)

REM Start Next.js in new window
echo [1/2] Starting Next.js server...
start "Next.js Dev Server" cmd /k npm run dev

REM Wait for Next.js to start
echo [INFO] Waiting for server to start...
timeout /t 5 /nobreak >nul

REM Find Next.js port and start ngrok
echo.
echo [2/2] Starting ngrok tunnel...
echo.

REM Use the start-ngrok script
call scripts\start-ngrok.bat

