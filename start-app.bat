@echo off
echo Starting AI Task Manager...
echo.

echo Killing any existing processes on ports 3000 and 8000...
npx kill-port 3000 2>nul
npx kill-port 8000 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Starting Backend Server on port 8000...
cd backend
start "Backend Server" cmd /k "node server-port8000.js"

echo.
echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo Starting Frontend on port 3000...
cd ..\frontend
start "Frontend App" cmd /k "npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause >nul