# BIOLAB - Script de Despliegue a Firebase
# PowerShell Script

Write-Host "========================================"  -ForegroundColor Cyan
Write-Host "   BIOLAB - Despliegue a Firebase"  -ForegroundColor Cyan
Write-Host "========================================"  -ForegroundColor Cyan
Write-Host ""

# Función para verificar comandos
function Test-Command {
    param($Command)
    try {
        if (Get-Command $Command -ErrorAction Stop) {
            return $true
        }
    }
    catch {
        return $false
    }
}

# Verificar Node.js
Write-Host "[Verificación] Comprobando Node.js..." -ForegroundColor Yellow
if (Test-Command node) {
    $nodeVersion = node --version
    Write-Host "✓ Node.js instalado: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js no está instalado" -ForegroundColor Red
    Write-Host "Por favor, instálalo desde https://nodejs.org/" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Verificar Firebase CLI
Write-Host "[Verificación] Comprobando Firebase CLI..." -ForegroundColor Yellow
if (Test-Command firebase) {
    $firebaseVersion = firebase --version
    Write-Host "✓ Firebase CLI instalado: $firebaseVersion" -ForegroundColor Green
} else {
    Write-Host "⚠ Firebase CLI no está instalado" -ForegroundColor Yellow
    Write-Host "Instalando Firebase CLI globalmente..." -ForegroundColor Yellow
    npm install -g firebase-tools
}

Write-Host ""
Write-Host "[1/4] Instalando dependencias..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Error al instalar dependencias" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}
Write-Host "✓ Dependencias instaladas" -ForegroundColor Green

Write-Host ""
Write-Host "[2/4] Construyendo el proyecto..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Error al construir el proyecto" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}
Write-Host "✓ Proyecto construido exitosamente" -ForegroundColor Green

Write-Host ""
Write-Host "[3/4] Verificando autenticación..." -ForegroundColor Cyan
$authCheck = firebase projects:list 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Necesitas iniciar sesión en Firebase..." -ForegroundColor Yellow
    firebase login
}
Write-Host "✓ Autenticación verificada" -ForegroundColor Green

Write-Host ""
Write-Host "[4/4] Desplegando a Firebase Hosting..." -ForegroundColor Cyan
firebase deploy --only hosting

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "   ¡DESPLIEGUE EXITOSO!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Tu sitio está disponible en:" -ForegroundColor White
    Write-Host "• https://biolab-demowebsite.web.app" -ForegroundColor Cyan
    Write-Host "• https://biolab-demowebsite.firebaseapp.com" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Los cambios pueden tardar 2-3 minutos en verse reflejados." -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "✗ Error durante el despliegue" -ForegroundColor Red
    Write-Host "Por favor, revisa los mensajes de error anteriores" -ForegroundColor Red
}

Write-Host ""
Read-Host "Presiona Enter para salir"
