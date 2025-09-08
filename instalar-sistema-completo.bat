@echo off
echo ========================================
echo   BIOLAB - Instalación Completa
echo ========================================
echo.
echo Este script instalará y configurará todo lo necesario
echo para ejecutar el sistema BIOLAB completo.
echo.

REM Verificar Node.js
echo [1/5] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js NO está instalado
    echo.
    echo Por favor, instala Node.js desde:
    echo https://nodejs.org/
    echo.
    echo Descarga la versión LTS (recomendada)
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do echo ✅ Node.js instalado: %%i
)

REM Verificar MongoDB
echo.
echo [2/5] Verificando MongoDB...
where mongod >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  MongoDB NO está instalado o no está en el PATH
    echo.
    echo Para instalar MongoDB:
    echo 1. Visita: https://www.mongodb.com/try/download/community
    echo 2. Descarga MongoDB Community Server
    echo 3. Instala con las opciones por defecto
    echo 4. Asegúrate de marcar "Install MongoDB as a Service"
    echo.
    echo ¿Continuar sin MongoDB? (S/N)
    choice /C SN /N
    if errorlevel 2 (
        exit /b 1
    )
) else (
    echo ✅ MongoDB encontrado
)

REM Instalar dependencias del Backend
echo.
echo [3/5] Instalando dependencias del Backend...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Error al instalar dependencias del backend
    cd ..
    pause
    exit /b 1
)
echo ✅ Dependencias del backend instaladas
cd ..

REM Instalar dependencias del Frontend
echo.
echo [4/5] Instalando dependencias del Frontend...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Error al instalar dependencias del frontend
    pause
    exit /b 1
)
echo ✅ Dependencias del frontend instaladas

REM Crear carpeta para archivos protegidos
echo.
echo [5/5] Creando estructura de carpetas...
if not exist "backend\protected_files" mkdir backend\protected_files
if not exist "backend\protected_files\results" mkdir backend\protected_files\results
echo ✅ Estructura de carpetas creada

echo.
echo ========================================
echo   ¡INSTALACIÓN COMPLETA!
echo ========================================
echo.
echo ✅ El sistema está listo para usar.
echo.
echo 📋 Próximos pasos:
echo.
echo 1. Crear datos de prueba (opcional):
echo    Ejecuta: crear-datos-prueba.bat
echo.
echo 2. Iniciar el sistema completo:
echo    Ejecuta: iniciar-sistema-completo.bat
echo.
echo 3. O iniciar solo el frontend (modo demo):
echo    Ejecuta: npm run dev
echo.
echo ========================================
echo.
pause
