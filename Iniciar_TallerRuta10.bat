@echo off
chcp 65001 >nul
title Lanzador - Auto Servicio Ruta 10
color 0B

echo ============================================================================
echo               AUTO SERVICIO RUTA 10 - LANZADOR EN 1 CLICK
echo ============================================================================
echo.

set "ROOT_DIR=%~dp0"
set "BACK_DIR=%ROOT_DIR%backend\Taller_back"
set "FRONT_DIR=%ROOT_DIR%frontend"

echo [1/4] Verificando certificado HTTPS de desarrollo (.NET)...
dotnet dev-certs https --trust >nul 2>&1

echo [2/4] Verificando dependencias del Frontend (Node.js / Vite)...
if not exist "%FRONT_DIR%\node_modules" (
    echo Instalando paquetes npm por primera vez...
    pushd "%FRONT_DIR%"
    call npm.cmd install
    popd
)

echo [3/4] Iniciando Backend API (.NET 8 + SQL Server Express: TallerRuta10DB)...
start "Taller Ruta 10 - Backend API" cmd /k "cd /d "%BACK_DIR%" && echo Iniciando API en https://localhost:7265 ... && dotnet run --launch-profile https"

echo [4/4] Iniciando Frontend Web (React + TypeScript + Vite)...
start "Taller Ruta 10 - Frontend Web" cmd /k "cd /d "%FRONT_DIR%" && echo Iniciando Web en http://localhost:5173 ... && npm.cmd run dev"

echo.
echo Esperando 6 segundos mientras los servidores terminan de levantar...
timeout /t 6 /nobreak >nul

echo Abriendo navegador en http://localhost:5173 y Swagger en https://localhost:7265/swagger ...
start "" "http://localhost:5173"
start "" "https://localhost:7265/swagger"

echo.
echo ============================================================================
echo   SISTEMA EN EJECUCION
echo ============================================================================
echo   * Sitio Web Publico:     http://localhost:5173
echo   * Login Administrativo:  http://localhost:5173/admin/login
echo   * Swagger Backend API:   https://localhost:7265/swagger
echo   * Base de Datos SQL:     localhost\SQLEXPRESS (TallerRuta10DB)
echo ----------------------------------------------------------------------------
echo   CREDENCIALES DEL PANEL ADMINISTRATIVO:
echo     - Usuario: admin          ^| Contrasena: Admin123!
echo     - Usuario: Leo Cortes     ^| Contrasena: 123456
echo ============================================================================
echo.
echo Presiona cualquier tecla para cerrar esta ventana informativa...
pause >nul
