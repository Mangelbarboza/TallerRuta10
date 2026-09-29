@echo off
chcp 65001 >nul
title Detener - Auto Servicio Ruta 10
echo Cerrando servidores de Auto Servicio Ruta 10...
taskkill /FI "WINDOWTITLE eq Taller Ruta 10 - Backend API*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Taller Ruta 10 - Frontend Web*" /T /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":7265 :5275 :5173" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
echo Servidores detenidos correctamente.
timeout /t 2 >nul
