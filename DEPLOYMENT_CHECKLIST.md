# ✅ Checklist de Despliegue - BIOLAB

## 📋 Antes de Desplegar

### Verificación de Contenido
- [ ] La dirección está correcta: **Cra. 45a #95-70, Bogotá D.C.**
- [ ] Los números de teléfono son correctos
- [ ] El correo electrónico funciona: contacto@biolabsas.com
- [ ] Los horarios de atención están actualizados
- [ ] No hay información de prueba o placeholder

### Verificación Técnica
- [ ] El proyecto compila sin errores: `npm run build`
- [ ] No hay console.log() en el código de producción
- [ ] Todas las imágenes están optimizadas (< 200KB cada una)
- [ ] Los enlaces internos funcionan correctamente
- [ ] El formulario de contacto está configurado
- [ ] El modal de resultados funciona

### Verificación de Diseño
- [ ] El sitio se ve bien en móviles (320px - 768px)
- [ ] El sitio se ve bien en tablets (768px - 1024px)
- [ ] El sitio se ve bien en desktop (1024px+)
- [ ] Las animaciones funcionan suavemente
- [ ] Los colores corporativos están correctos

### Verificación de SEO
- [ ] El título de la página es descriptivo
- [ ] La descripción meta está configurada
- [ ] Las imágenes tienen atributos alt
- [ ] El sitio carga en menos de 3 segundos

## 🚀 Proceso de Despliegue

### 1. Preparación
```bash
# Guardar todos los cambios
git add .
git commit -m "Preparando para despliegue a producción"

# Verificar que todo funciona localmente
npm run dev
```

### 2. Build de Producción
```bash
# Crear build optimizado
npm run build

# Verificar el build localmente
npm run preview
```

### 3. Despliegue a Firebase

#### Opción A: Usar el script automático (Recomendado)
Doble clic en `deploy-firebase.bat`

#### Opción B: Comando manual
```bash
npm run deploy
```

#### Opción C: Paso a paso
```bash
firebase login
npm run build
firebase deploy --only hosting
```

## 🔍 Verificación Post-Despliegue

### Inmediatamente después del despliegue:
- [ ] El sitio carga en https://biolab-demowebsite.web.app
- [ ] El sitio carga en https://biolab-demowebsite.firebaseapp.com
- [ ] La navegación funciona correctamente
- [ ] Los modales se abren sin problemas
- [ ] Las imágenes cargan correctamente
- [ ] El mapa muestra la ubicación correcta

### Pruebas funcionales:
- [ ] Navegar por todas las secciones
- [ ] Probar el modal de resultados
- [ ] Probar los enlaces de contacto
- [ ] Verificar en diferentes navegadores:
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge
- [ ] Verificar en dispositivos móviles

## 📊 Monitoreo

### Firebase Console
- URL: https://console.firebase.google.com/project/biolab-demowebsite/hosting
- Verificar:
  - [ ] Uso del ancho de banda
  - [ ] Número de visitas
  - [ ] Errores 404
  - [ ] Velocidad de carga

### Google Analytics (si está configurado)
- Verificar:
  - [ ] El tracking está funcionando
  - [ ] Las páginas se registran correctamente
  - [ ] Los eventos se capturan

## 🐛 Solución de Problemas Comunes

### El sitio no se actualiza
- Limpiar caché del navegador (Ctrl + F5)
- Esperar 5-10 minutos para propagación
- Verificar en modo incógnito

### Error 404 en rutas
- Verificar firebase.json tiene el rewrite configurado
- Verificar que el build se completó correctamente

### Las imágenes no cargan
- Verificar que las imágenes están en la carpeta public
- Verificar las rutas en el código

### El formulario no funciona
- Configurar el backend o servicio de email
- Verificar las variables de entorno

## 📞 Contactos de Soporte

### Desarrollo
- Desarrollador: [Tu nombre]
- Email: [Tu email]

### Firebase
- Documentación: https://firebase.google.com/docs/hosting
- Estado del servicio: https://status.firebase.google.com/

## 📝 Notas

- Siempre hacer backup antes de grandes cambios
- Probar en staging antes de producción
- Documentar cualquier cambio importante
- Mantener las dependencias actualizadas

---

**Última actualización:** Diciembre 2024
**Versión:** 1.0.0
