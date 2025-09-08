@echo off
echo ========================================
echo   BIOLAB - Reconstruir y Desplegar
echo ========================================
echo.
echo Este script reconstruira el proyecto con los ultimos cambios
echo y lo desplegara en Firebase Hosting.
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no está instalado. Por favor, instálalo desde https://nodejs.org/
    pause
    exit /b 1
)

echo [1/5] Limpiando build anterior...
if exist dist (
    rmdir /s /q dist
    echo Build anterior eliminado.
)
echo.

echo [2/5] Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Error al instalar dependencias
    pause
    exit /b 1
)
echo.

echo [3/5] Construyendo el proyecto...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Error al construir el proyecto
    pause
    exit /b 1
)
echo.

echo [4/5] Verificando autenticación con Firebase...
firebase projects:list >nul 2>&1
if %errorlevel% neq 0 (
    echo Necesitas iniciar sesión en Firebase...
    firebase login
)
echo.

echo [5/5] Desplegando a Firebase Hosting...
firebase deploy --only hosting

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   ¡DESPLIEGUE EXITOSO!
    echo ========================================
    echo.
    echo Los cambios han sido aplicados:
    echo - Dirección actualizada a Bogotá
    echo - Modales funcionando sin backend
    echo - Sistema en modo demostración
    echo.
    echo Tu sitio está disponible en:
    echo - https://biolab-demowebsite.web.app
    echo - https://biolab-demowebsite.firebaseapp.com
    echo.
    echo NOTA: El caché del navegador puede tardar 5-10 minutos
    echo en actualizarse. Prueba en modo incógnito si no ves los cambios.
    echo.
) else (
    echo.
    echo [ERROR] Hubo un problema con el despliegue
    echo Por favor, revisa los mensajes de error anteriores
    echo.
)

pause
