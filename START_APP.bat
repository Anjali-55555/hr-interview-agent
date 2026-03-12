@echo off
title AI HR Agent Pro - Startup
color 0A

echo.
echo  ============================================
echo   AI HR Agent Pro - Starting...
echo  ============================================
echo.

:: Start Docker containers
echo  [1/2] Starting Docker containers...
cd /d "C:\Users\user\Downloads\hr-interview-agent\hr-interview-agent"
docker-compose up -d

echo.
echo  [2/2] Starting ngrok tunnel...
echo.
echo  ============================================
echo   App will be available at ngrok URL below
echo   Share the https://xxxx.ngrok-free.dev URL
echo   Local access: https://localhost
echo  ============================================
echo.

:: Start ngrok
ngrok http https://localhost --host-header=localhost

pause
