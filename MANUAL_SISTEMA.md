# 🏥 BIOLAB - Sistema de Gestión de Laboratorio Clínico

## 📋 Tabla de Contenidos
1. [Descripción General](#descripción-general)
2. [Requisitos del Sistema](#requisitos-del-sistema)
3. [Instalación](#instalación)
4. [Configuración](#configuración)
5. [Modos de Operación](#modos-de-operación)
6. [Uso del Sistema](#uso-del-sistema)
7. [Solución de Problemas](#solución-de-problemas)

---

## 📝 Descripción General

BIOLAB es un sistema completo de gestión para laboratorios clínicos que incluye:
- **Frontend**: Aplicación React con diseño moderno y responsive
- **Backend**: API REST con Node.js, Express y MongoDB
- **Base de Datos**: MongoDB para almacenamiento de datos

### Características principales:
- ✅ Portal de pacientes para consulta de resultados
- ✅ Portal de empleados (auxiliares y médicos)
- ✅ Gestión de pacientes y exámenes
- ✅ Carga y descarga de resultados en PDF
- ✅ Sistema de autenticación con JWT
- ✅ Auditoría de acciones

---

## 🖥️ Requisitos del Sistema

### Software Necesario:
1. **Node.js** (v14 o superior)
   - Descarga: https://nodejs.org/
   
2. **MongoDB** (v4.4 o superior)
   - Descarga: https://www.mongodb.com/try/download/community
   
3. **Git** (opcional)
   - Descarga: https://git-scm.com/

### Requisitos de Hardware:
- RAM: 4GB mínimo (8GB recomendado)
- Espacio en disco: 2GB libre
- Procesador: Dual-core o superior

---

## 🚀 Instalación

### Opción 1: Instalación Automática (Recomendada)

```batch
# Ejecuta el script de instalación
instalar-sistema-completo.bat
```

Este script:
- ✅ Verifica requisitos
- ✅ Instala dependencias
- ✅ Crea estructura de carpetas
- ✅ Configura el sistema

### Opción 2: Instalación Manual

#### 1. Instalar MongoDB
```batch
# Descargar e instalar MongoDB Community Server
# https://www.mongodb.com/try/download/community
# Asegúrate de marcar "Install MongoDB as a Service"
```

#### 2. Instalar dependencias del Backend
```batch
cd backend
npm install
cd ..
```

#### 3. Instalar dependencias del Frontend
```batch
npm install
```

#### 4. Crear estructura de carpetas
```batch
mkdir backend\protected_files
mkdir backend\protected_files\results
```

---

## ⚙️ Configuración

### Variables de Entorno

#### Backend (.env)
```env
# backend/.env
MONGODB_URI=mongodb://localhost:27017/biolab
JWT_SECRET=biolab-secret-key-2024-secure-token
PORT=5000
NODE_ENV=development
```

#### Frontend (.env)
```env
# .env (en la raíz del proyecto)
VITE_API_URL=http://localhost:5000
VITE_DEMO_MODE=false
```

### Configuración de Modos

Para cambiar entre modo demo y modo con backend, edita `.env`:

```env
# Modo con Backend Real
VITE_DEMO_MODE=false

# Modo Demo (sin backend)
VITE_DEMO_MODE=true
```

---

## 🎮 Modos de Operación

### Modo 1: Sistema Completo (Frontend + Backend)

```batch
# 1. Crear datos de prueba (primera vez)
crear-datos-prueba.bat

# 2. Iniciar sistema completo
iniciar-sistema-completo.bat
```

**URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Modo 2: Solo Frontend (Modo Demo)

```batch
# Configurar modo demo en .env
echo VITE_DEMO_MODE=true > .env

# Iniciar solo frontend
npm run dev
```

**URL:** http://localhost:3000

### Modo 3: Despliegue en Firebase (Solo Frontend)

```batch
# Construir y desplegar
npm run deploy
```

**URL:** https://biolab-demowebsite.web.app

---

## 👥 Uso del Sistema

### Usuarios de Prueba

#### Portal de Empleados (/portal-empleados)

| Rol | Usuario | Contraseña | Permisos |
|-----|---------|------------|----------|
| Admin | admin | password123 | Acceso total |
| Médico | dr.martinez | password123 | Ver/subir resultados |
| Auxiliar | aux.rodriguez | password123 | Registrar pacientes |

#### Portal de Pacientes

| Paciente | Documento | Código | 
|----------|-----------|---------|
| Juan Pérez | 1234567890 | TEST1234 |
| María González | 0987654321 | TEST5678 |

### Flujo de Trabajo

#### 1. Registro de Paciente (Auxiliar)
1. Iniciar sesión como auxiliar
2. Click en "Registrar Nuevo Paciente"
3. Llenar formulario con datos del paciente
4. Seleccionar exámenes a realizar
5. Guardar y entregar código al paciente

#### 2. Subir Resultados (Médico)
1. Iniciar sesión como médico
2. Buscar paciente por nombre o documento
3. Click en ver detalles
4. Subir archivo PDF con resultados
5. Guardar cambios

#### 3. Consultar Resultados (Paciente)
1. Click en "Resultados en Línea"
2. Ingresar documento y código de atención
3. Ver o descargar resultados en PDF

---

## 🔧 Solución de Problemas

### Error: MongoDB no está instalado

**Solución:**
1. Descargar MongoDB: https://www.mongodb.com/try/download/community
2. Instalar con opciones por defecto
3. Verificar que el servicio esté ejecutándose:
   ```batch
   net start MongoDB
   ```

### Error: Puerto 5000 en uso

**Solución:**
1. Cambiar puerto en `backend/.env`:
   ```env
   PORT=5001
   ```
2. Actualizar frontend en `.env`:
   ```env
   VITE_API_URL=http://localhost:5001
   ```

### Error: Failed to fetch (CORS)

**Solución:**
Verificar que el backend esté ejecutándose:
```batch
cd backend
npm start
```

### Error: Token inválido o expirado

**Solución:**
1. Cerrar sesión
2. Volver a iniciar sesión
3. Los tokens expiran después de 8 horas

---

## 📊 Arquitectura del Sistema

```
BIOLAB/
├── frontend/               # Aplicación React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/        # Páginas (Portal empleados)
│   │   └── config/       # Configuración API
│   └── public/           # Archivos estáticos
│
├── backend/              # API REST
│   ├── server.js        # Servidor Express
│   ├── seed.js          # Script de datos de prueba
│   └── protected_files/ # Archivos PDF
│
└── scripts/             # Scripts de utilidad
    ├── instalar-sistema-completo.bat
    ├── iniciar-sistema-completo.bat
    ├── crear-datos-prueba.bat
    └── deploy-firebase.bat
```

---

## 🔒 Seguridad

### Características de Seguridad:
- ✅ Autenticación con JWT
- ✅ Contraseñas encriptadas con bcrypt
- ✅ Códigos de atención hasheados
- ✅ Validación de roles y permisos
- ✅ Auditoría de acciones
- ✅ Archivos protegidos fuera del directorio público

### Recomendaciones:
1. Cambiar `JWT_SECRET` en producción
2. Usar HTTPS en producción
3. Configurar CORS adecuadamente
4. Implementar rate limiting
5. Hacer backups regulares de MongoDB

---

## 📈 Monitoreo y Logs

### Ver logs del Backend:
```batch
cd backend
npm run dev
```

### Ver logs de MongoDB:
```batch
C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe --dbpath C:\data\db
```

### Auditoría de acciones:
Todas las acciones importantes se registran en la colección `auditlogs` de MongoDB.

---

## 🚀 Despliegue en Producción

### Recomendaciones:
1. **Frontend**: Vercel, Netlify o Firebase Hosting
2. **Backend**: Heroku, Railway o DigitalOcean
3. **MongoDB**: MongoDB Atlas (cloud)

### Variables de producción:
```env
# Backend
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<generar-token-seguro>

# Frontend
VITE_API_URL=https://api.biolabsas.com
VITE_DEMO_MODE=false
```

---

## 📞 Soporte

### Contacto:
- Email: contacto@biolabsas.com
- Teléfono: +57 318 123 4567
- Dirección: Cra. 45a #95-70, Bogotá D.C.

### Recursos:
- Documentación: Este archivo
- Estado del sistema: https://console.firebase.google.com/project/biolab-demowebsite
- Repositorio: [Privado]

---

## 📄 Licencia

© 2024 Laboratorio Clínico BIOLAB S.A.S. Todos los derechos reservados.

---

**Última actualización:** Diciembre 2024
**Versión:** 1.0.0
