@echo off
title AI HR Agent Pro - Stopping
color 0C

echo.
echo  ============================================
echo   AI HR Agent Pro - Stopping...
echo  ============================================
echo.

:: Stop ngrok
echo  [1/2] Stopping ngrok...
taskkill /f /im ngrok.exe >nul 2>&1

:: Stop Docker containers
echo  [2/2] Stopping Docker containers...
cd /d "C:\Users\user\Downloads\hr-interview-agent\hr-interview-agent"
docker-compose down

echo.
echo  ============================================
echo   App stopped successfully!
echo  ============================================
echo.
pause
