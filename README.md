# ULIS — Urban Legal Intelligence System

Plataforma interna (SPA) con **Supabase** (Postgres + Auth + Storage) para consultoría legal, urbanística e inmobiliaria. Cada usuario recibe al registrarse el expediente **Cañaveral – Península** (estructura real en base de datos, sin archivos hasta que los suba). Puede crear **más proyectos** con la misma plantilla vía RPC.

## Requisitos

- Node.js 20+
- Proyecto [Supabase](https://supabase.com) con el SQL aplicado

## Configuración Supabase

1. Cree un proyecto en Supabase.
2. En **SQL Editor**, ejecute **todo** el archivo `supabase/schema.sql` (una sola vez en un proyecto vacío o tras revisar conflictos de nombres).
3. **Authentication → Providers**: active **Email** (correo + contraseña).
4. **Authentication → URL configuration**: añada `http://localhost:5173` (y su dominio de producción).
5. Si el `INSERT` del bucket falla, cree manualmente el bucket privado **`project-files`** y vuelva a ejecutar solo el bloque de políticas `storage.objects` del SQL.
6. Copie `.env.example` a `.env` y rellene `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (Settings → API).

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

React 19, Vite 8, TypeScript, Tailwind CSS v4, Radix UI, React Router, `@supabase/supabase-js`.

## Datos

Todo el checklist, KPIs, MCN, radicación, licenciamiento y métricas normativas viven en **Supabase**. Los archivos van al bucket **`project-files`** en la ruta `{user_id}/{project_id}/{document_id}/{nombre}`.
