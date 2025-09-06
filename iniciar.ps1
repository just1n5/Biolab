# BIOLAB - Laboratorio Clínico
# Script de instalación y ejecución

function Show-Menu {
    Clear-Host
    Write-Host "====================================" -ForegroundColor Cyan
    Write-Host "   BIOLAB - Laboratorio Clínico" -ForegroundColor Cyan
    Write-Host "   Instalación y Configuración" -ForegroundColor Cyan
    Write-Host "====================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Instalar dependencias" -ForegroundColor Yellow
    Write-Host "2. Iniciar servidor de desarrollo" -ForegroundColor Yellow
    Write-Host "3. Construir para producción" -ForegroundColor Yellow
    Write-Host "4. Ver preview de producción" -ForegroundColor Yellow
    Write-Host "5. Instalar e iniciar" -ForegroundColor Yellow
    Write-Host "6. Limpiar cache y node_modules" -ForegroundColor Yellow
    Write-Host "7. Salir" -ForegroundColor Yellow
    Write-Host ""
}

function Install-Dependencies {
    Write-Host ""
    Write-Host "Instalando dependencias..." -ForegroundColor Green
    npm install
    Write-Host ""
    Write-Host "✓ Dependencias instaladas exitosamente!" -ForegroundColor Green
    Write-Host ""
    Pause
}

function Start-Development {
    Write-Host ""
    Write-Host "Iniciando servidor de desarrollo..." -ForegroundColor Green
    Write-Host "El proyecto se abrirá en http://localhost:3000" -ForegroundColor Cyan
    Write-Host "Presione Ctrl+C para detener el servidor" -ForegroundColor Yellow
    Write-Host ""
    npm run dev
    Pause
}

function Build-Production {
    Write-Host ""
    Write-Host "Construyendo para producción..." -ForegroundColor Green
    npm run build
    Write-Host ""
    Write-Host "✓ Construcción completada! Los archivos están en la carpeta 'dist'" -ForegroundColor Green
    Write-Host ""
    Pause
}

function Preview-Production {
    Write-Host ""
    Write-Host "Iniciando preview de producción..." -ForegroundColor Green
    npm run preview
    Pause
}

function Install-And-Start {
    Install-Dependencies
    Start-Development
}

function Clean-Project {
    Write-Host ""
    Write-Host "Limpiando proyecto..." -ForegroundColor Yellow
    
    if (Test-Path "node_modules") {
        Remove-Item -Recurse -Force node_modules
        Write-Host "✓ node_modules eliminado" -ForegroundColor Green
    }
    
    if (Test-Path "dist") {
        Remove-Item -Recurse -Force dist
        Write-Host "✓ dist eliminado" -ForegroundColor Green
    }
    
    if (Test-Path "package-lock.json") {
        Remove-Item -Force package-lock.json
        Write-Host "✓ package-lock.json eliminado" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "✓ Proyecto limpiado exitosamente!" -ForegroundColor Green
    Write-Host ""
    Pause
}

# Bucle principal
do {
    Show-Menu
    $opcion = Read-Host "Ingrese su opción (1-7)"
    
    switch ($opcion) {
        '1' { Install-Dependencies }
        '2' { Start-Development }
        '3' { Build-Production }
        '4' { Preview-Production }
        '5' { Install-And-Start }
        '6' { Clean-Project }
        '7' { 
            Write-Host ""
            Write-Host "¡Gracias por usar BIOLAB Lab System!" -ForegroundColor Cyan
            Write-Host ""
            break 
        }
        default {
            Write-Host ""
            Write-Host "Opción inválida. Por favor intente de nuevo." -ForegroundColor Red
            Write-Host ""
            Pause
        }
    }
} while ($opcion -ne '7')
