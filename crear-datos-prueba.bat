@echo off
echo ========================================
echo   BIOLAB - Crear Datos de Prueba
echo ========================================
echo.

REM Verificar si MongoDB está ejecutándose
echo [1/2] Verificando MongoDB...
net start | find "MongoDB" >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ⚠️  MongoDB no parece estar ejecutándose.
    echo.
    echo Por favor, asegúrate de que MongoDB esté instalado y ejecutándose.
    echo Si no lo tienes instalado:
    echo 1. Descarga MongoDB Community Server desde:
    echo    https://www.mongodb.com/try/download/community
    echo 2. Instálalo con las opciones por defecto
    echo 3. MongoDB se iniciará automáticamente como servicio
    echo.
    echo ¿Deseas continuar de todos modos? (S/N)
    choice /C SN /N
    if errorlevel 2 (
        echo Operación cancelada.
        pause
        exit /b 1
    )
)

echo.
echo [2/2] Creando datos de prueba en la base de datos...
cd backend
node seed.js

echo.
echo ========================================
echo   DATOS DE PRUEBA CREADOS
echo ========================================
echo.
echo Los siguientes usuarios y pacientes han sido creados:
echo.
echo 👤 USUARIOS:
echo    Admin:    admin / password123
echo    Médico:   dr.martinez / password123
echo    Auxiliar: aux.rodriguez / password123
echo.
echo 👥 PACIENTES DE PRUEBA:
echo    Juan Pérez (CC: 1234567890) - Código: TEST1234
echo    María González (CC: 0987654321) - Código: TEST5678
echo.
echo Puedes usar estos datos para probar el sistema.
echo.
pause
