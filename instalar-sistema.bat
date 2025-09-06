@echo off
echo ==========================================
echo     INSTALACION SISTEMA BIOLAB COMPLETO
echo ==========================================
echo.

echo [1/5] Instalando dependencias del BACKEND...
cd backend
call npm install
if errorlevel 1 (
    echo ERROR: Fallo la instalacion del backend
    pause
    exit /b 1
)
echo ✓ Backend instalado correctamente
echo.

echo [2/5] Configurando MongoDB...
echo Asegurate de que MongoDB este corriendo en puerto 27017
echo.

echo [3/5] Creando datos de prueba...
call node seed.js
if errorlevel 1 (
    echo ERROR: Fallo la creacion de datos
    pause
    exit /b 1
)
echo ✓ Datos de prueba creados
echo.

echo [4/5] Volviendo al frontend...
cd ..

echo [5/5] Instalando dependencias del FRONTEND...
call npm install
if errorlevel 1 (
    echo ERROR: Fallo la instalacion del frontend
    pause
    exit /b 1
)
echo ✓ Frontend instalado correctamente
echo.

echo ==========================================
echo   INSTALACION COMPLETADA EXITOSAMENTE
echo ==========================================
echo.
echo Para iniciar el sistema, ejecuta: iniciar-sistema.bat
echo.
pause
