# 🧪 Laboratorio Clínico BIOLAB S.A.S.

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4.1-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4.10-38B2AC?style=flat-square&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.0.0-FF0080?style=flat-square&logo=framer)

## 📋 Descripción

Sitio web moderno y profesional para el Laboratorio Clínico BIOLAB S.A.S., diseñado como una Single Page Application (SPA) con React.js. La plataforma ofrece una experiencia digital intuitiva y confiable para pacientes, empresas y profesionales médicos.

### ✨ Características Principales

- **Diseño Responsive**: Adaptado perfectamente para móviles, tablets y escritorio
- **Animaciones Fluidas**: Implementadas con Framer Motion para una experiencia dinámica
- **Navegación Suave**: Scroll suave entre secciones con navegación sticky
- **Acceso Rápido**: Sistema de tarjetas interactivas para diferentes tipos de usuarios
- **Formulario PQRS**: Sistema integrado de peticiones, quejas, reclamos y sugerencias
- **Optimización SEO**: Meta tags y estructura optimizada para motores de búsqueda

## 🚀 Instalación

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de instalación

1. **Navegar al directorio del proyecto**
   ```bash
   cd "C:\Users\justi\Desktop\proyectos frontend\Pagina biolab"
   ```

2. **Instalar las dependencias**
   ```bash
   npm install
   ```
   o si prefieres yarn:
   ```bash
   yarn install
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```
   o con yarn:
   ```bash
   yarn dev
   ```

4. **Abrir en el navegador**
   
   El proyecto se abrirá automáticamente en `http://localhost:3000`

## 🏗️ Estructura del Proyecto

```
Pagina biolab/
├── public/              # Archivos públicos estáticos
├── src/
│   ├── components/      # Componentes React
│   │   ├── Navbar.jsx          # Barra de navegación
│   │   ├── HeroSection.jsx     # Sección principal
│   │   ├── QuickAccess.jsx     # Acceso rápido por perfil
│   │   ├── AboutSection.jsx    # Quiénes somos
│   │   ├── ServicesSection.jsx # Servicios
│   │   ├── SstSection.jsx      # Salud ocupacional
│   │   ├── ContactSection.jsx  # Contacto y PQRS
│   │   └── Footer.jsx          # Pie de página
│   ├── App.jsx         # Componente principal
│   ├── main.jsx        # Punto de entrada
│   └── index.css       # Estilos globales
├── index.html          # HTML principal
├── package.json        # Dependencias y scripts
├── vite.config.js      # Configuración de Vite
├── tailwind.config.js  # Configuración de Tailwind
└── postcss.config.js   # Configuración de PostCSS
```

## 🎨 Paleta de Colores

- **Turquesa Principal**: `#00B7B7`
- **Azul Claro**: `#31A3DD`
- **Azul**: `#136EBF`
- **Gris Oscuro**: `#494949`
- **Gris Medio**: `#777777`
- **Blanco**: `#FFFFFF`

## 📦 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Vista previa de la versión de producción
- `npm run lint` - Ejecuta el linter para verificar el código

## 🛠️ Tecnologías Utilizadas

- **React.js 18.3** - Framework de JavaScript
- **Vite 5.4** - Build tool y servidor de desarrollo
- **Tailwind CSS 3.4** - Framework CSS utility-first
- **Framer Motion 11.0** - Librería de animaciones
- **Lucide React** - Iconos vectoriales modernos

## 📱 Características Responsive

El sitio está completamente optimizado para:
- 📱 **Móviles** (320px - 768px)
- 📱 **Tablets** (768px - 1024px)
- 💻 **Desktop** (1024px+)

## 🔧 Personalización

### Modificar colores
Edita el archivo `tailwind.config.js` para cambiar la paleta de colores:

```javascript
colors: {
  'biolab-turquoise': '#00B7B7',
  'biolab-blue-light': '#31A3DD',
  'biolab-blue': '#136EBF',
  // ... más colores
}
```

### Cambiar fuentes
Las fuentes se cargan desde Google Fonts en `index.html`. Puedes modificarlas ahí y actualizar `tailwind.config.js`:

```javascript
fontFamily: {
  'poppins': ['Poppins', 'sans-serif'],
  'montserrat': ['Montserrat', 'sans-serif'],
}
```

## 🚀 Despliegue

Para construir el proyecto para producción:

```bash
npm run build
```

Esto generará una carpeta `dist` con los archivos optimizados listos para desplegar en cualquier servidor web estático.

### Opciones de despliegue recomendadas:
- **Vercel**: Despliegue automático con integración Git
- **Netlify**: Hosting gratuito con SSL
- **GitHub Pages**: Ideal para proyectos de portafolio
- **AWS S3 + CloudFront**: Para aplicaciones empresariales

## 📄 Licencia

© 2024 Laboratorio Clínico BIOLAB S.A.S. Todos los derechos reservados.

## 👨‍💻 Desarrollador

Desarrollado con ❤️ como proyecto de portafolio de desarrollo Frontend

## 📞 Soporte

Para cualquier consulta o soporte técnico:
- Email: contacto@biolabsas.com
- Teléfono: +57 318 123 4567

---

**Nota**: Este es un proyecto de demostración/portafolio. Para implementación en producción, asegúrese de:
- Configurar las variables de entorno apropiadas
- Implementar la funcionalidad del backend para formularios
- Agregar Google Analytics o herramientas de análisis
- Configurar certificados SSL
- Implementar políticas de seguridad CSP
