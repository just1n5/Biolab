@echo off
echo ========================================
echo   BIOLAB - Iniciar Sistema Completo
echo ========================================
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no está instalado. Por favor, instálalo desde https://nodejs.org/
    pause
    exit /b 1
)

echo [1/4] Instalando dependencias del Backend...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Error al instalar dependencias del backend
    pause
    exit /b 1
)
cd ..

echo.
echo [2/4] Instalando dependencias del Frontend...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Error al instalar dependencias del frontend
    pause
    exit /b 1
)

echo.
echo [3/4] Iniciando Backend en puerto 5000...
start cmd /k "cd backend && npm start"

echo.
echo [4/4] Esperando que el backend inicie...
timeout /t 5 /nobreak >nul

echo.
echo [5/5] Iniciando Frontend en puerto 3000...
start cmd /k "npm run dev"

echo.
echo ========================================
echo   ¡SISTEMA INICIADO!
echo ========================================
echo.
echo 📌 URLs del Sistema:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5000
echo.
echo 👤 Usuarios de prueba:
echo    Admin:    admin / password123
echo    Médico:   dr.martinez / password123
echo    Auxiliar: aux.rodriguez / password123
echo.
echo 📝 Para crear datos de prueba, ejecuta: crear-datos-prueba.bat
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
echo (Los servidores seguirán ejecutándose en las otras ventanas)
echo.
pause >nul
