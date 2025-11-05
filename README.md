# ADO - Sistema de Gestión de Proyectos Deportivos

Sistema de viabilización de proyectos deportivos construido con Next.js, React, Tailwind CSS y Shadcn UI.

## 🚀 Características

- **Gestión de bloques de contenido**: Cada bloque (Antecedentes, Actividades, Viajes) tiene su propio estado de viabilización y chat
- **Sistema de comentarios**: Comentarios persistentes usando localStorage
- **Navegación entre páginas**: Antecedentes, Actividades y Viajes
- **Interfaz moderna**: Diseñada con Shadcn UI y Tailwind CSS
- **Animaciones suaves**: Implementadas con Framer Motion

## 📦 Instalación

```bash
npm install
```

## 🛠️ Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🏗️ Build para producción

```bash
npm run build
npm start
```

## 🌐 Despliegue en Netlify

El proyecto está configurado para desplegarse automáticamente en Netlify:

1. El repositorio está conectado a Netlify
2. Netlify detectará automáticamente Next.js
3. El build se ejecutará automáticamente en cada push

### Configuración de Netlify

- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: 20

## 💾 Persistencia de datos

Los comentarios se guardan en `localStorage` del navegador de cada usuario. Para limpiar todos los comentarios:

1. Abre la consola del navegador (F12)
2. Ejecuta: `window.clearADOComments()`
3. Recarga la página

## 📁 Estructura del proyecto

```
app/
  ├── page.tsx              # Página de Antecedentes
  ├── actividades/
  │   ├── page.tsx          # Lista de actividades
  │   └── [id]/page.tsx     # Detalle de actividad
  └── viajes/
      └── page.tsx          # Lista de viajes

components/
  ├── composite/            # Componentes compuestos
  └── ui/                   # Componentes base de Shadcn

prototype-logic/            # Lógica de prototipado (separada)
  ├── use-blocks.ts         # Hook para gestión de bloques
  ├── message-helpers.ts    # Helpers para mensajes
  └── types.ts              # Tipos TypeScript
```

## 🛠️ Tecnologías

- **Next.js 16**: Framework React
- **React 19**: Biblioteca de UI
- **Tailwind CSS**: Estilos
- **Shadcn UI**: Componentes UI
- **Framer Motion**: Animaciones
- **TypeScript**: Tipado estático

## 📝 Notas

- Este es un prototipo de funcionalidad
- La lógica de prototipado está en `prototype-logic/` para no contaminar el código de producción
- Los comentarios persisten localmente en cada dispositivo/navegador
