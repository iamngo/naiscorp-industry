@echo off
REM Quick start script - uses auto-detect port
REM This script will automatically detect Next.js port and start ngrok

echo ========================================
echo   STARTING VIETNAM INDUSTRIAL SUPPLY CHAIN DEMO
echo ========================================
echo.

REM Start Next.js first
echo [1/2] Starting Next.js server...
start "Next.js Dev Server" cmd /k npm run dev

echo.
echo Waiting for server to start...
timeout /t 5 /nobreak >nul

echo.
echo [2/2] Starting Ngrok tunnel with auto-detect...
echo.

REM Use the auto-detect script
call scripts\start-ngrok.bat

echo.
echo ========================================
echo   DEMO IS STARTING...
echo ========================================
echo.
echo ✅ Next.js: Check terminal for port (usually 3000)
echo ✅ Ngrok Dashboard: http://localhost:4040
echo.
echo 📋 Next steps:
echo    1. Check Ngrok terminal for public URL
echo    2. Copy the "Forwarding" URL (https://xxx.ngrok-free.app)
echo    3. Share with your team!
echo.
pause

