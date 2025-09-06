# 🧪 Sistema Completo BIOLAB - Portal de Pacientes y Empleados

## 🚀 Instalación Rápida

### Requisitos previos:
- Node.js 16+ instalado
- MongoDB instalado y corriendo en puerto 27017

### Instalación automática (Windows):
```bash
# Ejecutar el script de instalación
instalar-sistema.bat

# Luego iniciar el sistema
iniciar-sistema.bat
```

### Instalación manual:

#### 1. Instalar Backend:
```bash
cd backend
npm install
node seed.js  # Crear datos de prueba
npm run dev   # Iniciar servidor
```

#### 2. Instalar Frontend (en otra terminal):
```bash
npm install
npm run dev
```

## 📋 Funcionalidades Implementadas

### ✅ Portal de Pacientes
- Login con documento y código de 8 dígitos
- Visualización de resultados PDF
- Descarga e impresión de resultados
- Tokens temporales de seguridad (1 hora)

### ✅ Portal de Empleados

#### Dashboard Auxiliar:
- Registro de nuevos pacientes
- Generación de códigos únicos
- Selección de exámenes a realizar
- Visualización de estadísticas del día

#### Dashboard Médico:
- Búsqueda avanzada de pacientes
- Subida de resultados PDF
- Gestión completa de visitas
- Eliminación de resultados

### ✅ Seguridad
- Autenticación JWT
- Contraseñas hasheadas con bcrypt
- Roles y permisos (RBAC)
- Auditoría completa de acciones

## 🔐 Credenciales de Prueba

### Portal de Pacientes:
```
Paciente 1:
- Tipo Doc: CC
- Número: 1234567890  
- Código: TEST1234

Paciente 2:
- Tipo Doc: CC
- Número: 0987654321
- Código: TEST5678
```

### Portal de Empleados:
```
Auxiliar:
- Usuario: aux.rodriguez
- Password: password123

Médico:
- Usuario: dr.martinez
- Password: password123

Admin:
- Usuario: admin
- Password: password123
```

## 🌐 URLs del Sistema

- **Frontend Principal**: http://localhost:5173
- **Portal Empleados**: http://localhost:5173/portal-empleados
- **Backend API**: http://localhost:5000

## 📁 Estructura del Proyecto

```
Pagina biolab/
├── backend/                  # Servidor Node.js + Express
│   ├── server.js            # Servidor principal con todas las rutas
│   ├── seed.js              # Script para datos de prueba
│   ├── package.json         # Dependencias del backend
│   ├── .env                 # Variables de entorno
│   └── protected_files/     # Almacenamiento de PDFs
│       └── results/
│
├── src/
│   ├── components/
│   │   ├── PatientLoginModal.jsx    ✨ # Modal login pacientes
│   │   ├── ResultsViewerModal.jsx   ✨ # Visor de resultados PDF
│   │   ├── HeroSection.jsx          ✅ # Actualizado con portales
│   │   ├── QuickAccess.jsx          ✅ # Enlaces a portales
│   │   └── [otros componentes...]
│   │
│   ├── pages/
│   │   └── EmployeePortal.jsx       ✨ # Portal completo empleados
│   │
│   └── App.jsx                       ✅ # Rutas configuradas
│
├── instalar-sistema.bat              ✨ # Script instalación
├── iniciar-sistema.bat               ✨ # Script arranque
└── package.json                      ✅ # Actualizado con router
```

## 🔄 Flujo del Sistema

### Flujo de Paciente:
1. Click en "Ver Resultados" en página principal
2. Ingresa documento y código de 8 dígitos
3. Sistema valida credenciales
4. Muestra PDF de resultados
5. Puede descargar o imprimir

### Flujo de Auxiliar:
1. Accede a /portal-empleados
2. Login con credenciales
3. Registra nuevo paciente
4. Sistema genera código único
5. Entrega código al paciente

### Flujo de Médico:
1. Accede a /portal-empleados
2. Login con credenciales
3. Busca paciente
4. Sube resultado PDF
5. Paciente puede ver resultados

## 🛠️ Comandos Útiles

### Backend:
```bash
cd backend
npm run dev          # Desarrollo
npm start           # Producción
node seed.js        # Recrear datos de prueba
```

### Frontend:
```bash
npm run dev         # Desarrollo
npm run build       # Build producción
npm run preview     # Preview del build
```

## 🐛 Solución de Problemas

### MongoDB no conecta:
```bash
# Windows - Iniciar MongoDB
mongod --dbpath="C:\data\db"

# Verificar conexión
mongo
> show dbs
```

### Puerto ocupado:
```bash
# Windows - Liberar puerto 5000
netstat -ano | findstr :5000
taskkill /PID [PID] /F
```

### Módulos no encontrados:
```bash
# Reinstalar dependencias
cd backend && npm install
cd .. && npm install
```

## 📊 API Endpoints

### Autenticación:
- `POST /api/patient/login` - Login pacientes
- `POST /api/auth/login` - Login empleados

### Pacientes:
- `POST /api/patients/register` - Registrar paciente [Auxiliar+]
- `GET /api/patients/search` - Buscar pacientes [Medico+]

### Resultados:
- `GET /api/results/:visitId` - Ver resultado [Paciente]
- `POST /api/visits/:visitId/upload` - Subir resultado [Medico+]
- `DELETE /api/visits/:visitId/results/:id` - Eliminar [Medico+]

### Visitas:
- `GET /api/visits/:visitId` - Detalles visita [Medico+]

## 🎨 Características del Sistema

- 🔒 **Seguridad**: JWT + bcrypt + RBAC
- 📱 **Responsive**: Adaptado a todos los dispositivos
- ⚡ **Rápido**: React + Vite optimizado
- 🎯 **Intuitivo**: UX/UI moderno y limpio
- 📊 **Completo**: Gestión integral de laboratorio
- 🔄 **Tiempo real**: Actualización instantánea

## 📝 Notas Importantes

1. **Códigos de atención** son de un solo uso y expiran en 30 días
2. **PDFs** se almacenan localmente (considerar S3 para producción)
3. **Tokens de pacientes** expiran en 1 hora por seguridad
4. **Base de datos** se puede limpiar con nuevo seed.js
5. **CORS** está abierto en desarrollo, restringir en producción

## 🚀 Próximos Pasos

Para producción:
1. Cambiar JWT_SECRET en .env
2. Configurar HTTPS
3. Implementar CDN para PDFs
4. Agregar notificaciones email/SMS
5. Configurar backups automáticos

---

**Sistema BIOLAB v1.0** - Desarrollado con ❤️ 
