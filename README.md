# ULIS — Urban Legal Intelligence System

Simulación de plataforma interna de consultoría legal, urbanística e inmobiliaria (SPA) para el seguimiento del proyecto **Cañaveral – Península** (Floridablanca).

## Requisitos

- Node.js 20+

## Desarrollo

```bash
npm install
npm run dev
```

## Producción

```bash
npm run build
npm run preview
```

## Stack

React 19, Vite 8, TypeScript, Tailwind CSS v4, Radix UI (patrones tipo shadcn/ui), React Router.

## Datos locales

El estado del checklist se persiste en `localStorage` bajo la clave `ulis.documentStates.v1`. Desde **Reportes** puede reiniciarse el expediente demo.
