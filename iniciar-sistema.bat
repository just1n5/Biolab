@echo off
echo ==========================================
echo     INICIANDO SISTEMA BIOLAB COMPLETO
echo ==========================================
echo.

echo Verificando MongoDB...
echo Si MongoDB no esta corriendo, inicialo con: mongod
echo.

echo Iniciando Backend en puerto 5000...
start cmd /k "cd backend && npm run dev"

echo Esperando 5 segundos para que inicie el backend...
timeout /t 5 /nobreak > nul

echo Iniciando Frontend en puerto 5173...
start cmd /k "npm run dev"

echo.
echo ==========================================
echo      SISTEMA BIOLAB INICIADO
echo ==========================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo Portal Empleados: http://localhost:5173/portal-empleados
echo.
echo CREDENCIALES DE PRUEBA:
echo ------------------------
echo PACIENTE:
echo   Documento: 1234567890
echo   Codigo: TEST1234
echo.
echo AUXILIAR:
echo   Usuario: aux.rodriguez
echo   Password: password123
echo.
echo MEDICO:
echo   Usuario: dr.martinez
echo   Password: password123
echo.
echo ADMIN:
echo   Usuario: admin
echo   Password: password123
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause > nul
