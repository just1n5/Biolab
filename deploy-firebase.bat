@echo off
echo ========================================
echo   BIOLAB - Despliegue a Firebase
echo ========================================
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no está instalado. Por favor, instálalo desde https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar si Firebase CLI está instalado
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ADVERTENCIA] Firebase CLI no está instalado.
    echo.
    echo Instalando Firebase CLI globalmente...
    npm install -g firebase-tools
    echo.
)

echo [1/4] Instalando dependencias...
echo.
call npm install

if %errorlevel% neq 0 (
    echo [ERROR] Error al instalar dependencias
    pause
    exit /b 1
)

echo.
echo [2/4] Construyendo el proyecto para producción...
echo.
call npm run build

if %errorlevel% neq 0 (
    echo [ERROR] Error al construir el proyecto
    pause
    exit /b 1
)

echo.
echo [3/4] Verificando autenticación con Firebase...
echo.
firebase projects:list >nul 2>&1
if %errorlevel% neq 0 (
    echo Necesitas iniciar sesión en Firebase...
    firebase login
)

echo.
echo [4/4] Desplegando a Firebase Hosting...
echo.
firebase deploy --only hosting

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   ¡DESPLIEGUE EXITOSO!
    echo ========================================
    echo.
    echo Tu sitio está disponible en:
    echo - https://biolab-demowebsite.web.app
    echo - https://biolab-demowebsite.firebaseapp.com
    echo.
    echo Puede tomar 2-3 minutos para que los cambios se vean reflejados.
    echo.
) else (
    echo.
    echo [ERROR] Hubo un problema con el despliegue
    echo Por favor, revisa los mensajes de error anteriores
    echo.
)

pause
