@echo off
REM Script tự động detect port Next.js và start ngrok
REM Usage: scripts\start-ngrok.bat [port]

setlocal enabledelayedexpansion

echo ========================================
echo   NGROK AUTO-START SCRIPT
echo ========================================
echo.

REM Check if port is provided as argument
if "%~1"=="" (
    echo [Searching for Next.js server...]
    call :find_nextjs_port
    if errorlevel 1 (
        echo.
        echo [ERROR] Next.js server not found!
        echo [TIP] Please start Next.js first: npm run dev
        pause
        exit /b 1
    )
    set PORT=!FOUND_PORT!
) else (
    set PORT=%~1
    echo [Using provided port: %PORT%]
    call :check_port %PORT%
    if errorlevel 1 (
        echo.
        echo [ERROR] Port %PORT% is not in use!
        echo [TIP] Please start Next.js on port %PORT% first
        pause
        exit /b 1
    )
)

REM Check if ngrok is installed
where ngrok >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ERROR] ngrok not found!
    echo [TIP] Install ngrok:
    echo    npm install -g ngrok
    echo    or download from https://ngrok.com/download
    pause
    exit /b 1
)

REM Check if ngrok is already running
tasklist /FI "IMAGENAME eq ngrok.exe" 2>NUL | find /I /N "ngrok.exe">NUL
if not errorlevel 1 (
    echo.
    echo [WARNING] ngrok is already running!
    echo [TIP] Stopping existing ngrok process...
    taskkill /F /IM ngrok.exe >nul 2>&1
    timeout /t 1 /nobreak >nul
)

echo.
echo [Starting ngrok tunnel on port %PORT%...]
echo.
echo [INFO] Ngrok Dashboard: http://localhost:4040
echo [INFO] Local Server: http://localhost:%PORT%
echo.
echo [IMPORTANT] Copy the forwarding URL from ngrok output above!
echo.

REM Start ngrok
ngrok http %PORT%

exit /b 0

:find_nextjs_port
REM Common Next.js ports
set PORTS=3000 3001 3002 3003 3004 3005

for %%p in (%PORTS%) do (
    call :check_port %%p
    if not errorlevel 1 (
        REM Try to verify it's Next.js by checking if it responds
        curl -s http://localhost:%%p >nul 2>&1
        if not errorlevel 1 (
            echo [SUCCESS] Found Next.js running on port %%p
            set FOUND_PORT=%%p
            exit /b 0
        )
    )
)

exit /b 1

:check_port
REM Check if port is in use using netstat
netstat -an 2>nul | findstr ":%1 " >nul 2>&1
exit /b %errorlevel%

