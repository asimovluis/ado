# Despliegue en Netlify

Este proyecto está configurado para desplegarse en Netlify.

## Pasos para desplegar

### Opción 1: Desde la interfaz de Netlify (Recomendado)

1. **Preparar el repositorio Git:**
   ```bash
   git add .
   git commit -m "Preparar para despliegue en Netlify"
   git push origin main
   ```

2. **Crear cuenta en Netlify:**
   - Ve a [netlify.com](https://www.netlify.com)
   - Inicia sesión con GitHub/GitLab/Bitbucket

3. **Conectar el repositorio:**
   - Click en "Add new site" > "Import an existing project"
   - Selecciona tu repositorio
   - Netlify detectará automáticamente Next.js

4. **Configuración (debería estar automática):**
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Node version:** 20 (o superior)

5. **Desplegar:**
   - Click en "Deploy site"
   - Espera a que termine el build
   - Tu sitio estará disponible en una URL como `https://tu-proyecto.netlify.app`

### Opción 2: Con Netlify CLI

1. **Instalar Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Iniciar sesión:**
   ```bash
   netlify login
   ```

3. **Inicializar el sitio:**
   ```bash
   netlify init
   ```
   - Sigue las instrucciones para conectar con tu repositorio Git

4. **Desplegar:**
   ```bash
   netlify deploy --prod
   ```

## Configuración

El archivo `netlify.toml` ya está configurado con:
- Build command: `npm run build`
- Plugin oficial de Next.js: `@netlify/plugin-nextjs`
- Node version: 20

## Variables de entorno

Si necesitas variables de entorno:
1. Ve a Site settings > Build & deploy > Environment variables
2. Agrega las variables necesarias

## Notas importantes

- El plugin `@netlify/plugin-nextjs` se instala automáticamente durante el build
- Los comentarios se guardan en localStorage del navegador de cada usuario
- Para limpiar comentarios: abrir consola del navegador y ejecutar `window.clearADOComments()`

## Troubleshooting

Si el build falla:
1. Verifica que Node.js 20 esté disponible
2. Revisa los logs de build en Netlify
3. Asegúrate de que todas las dependencias estén en `package.json`

