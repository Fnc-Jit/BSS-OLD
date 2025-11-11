@echo off
REM Neo-BBS Development Server Startup Script (Windows)
REM This script starts both the frontend and backend servers

echo.
echo 🎃 Starting Neo-BBS Development Servers...
echo.

REM Start Backend Server
echo 🔧 Starting Backend Server...
start "Neo-BBS Backend" cmd /k "cd backend && uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start Frontend Server
echo 🌐 Starting Frontend Server...
start "Neo-BBS Frontend" cmd /k "cd frontend && npm start"

echo.
echo ✅ Servers are starting up!
echo.
echo 📍 Access your Neo-BBS at:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:8000
echo    API Docs: http://localhost:8000/docs
echo.
echo Close the terminal windows to stop the servers
echo.
pause
