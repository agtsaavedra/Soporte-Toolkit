# Soporte Toolkit

Aplicación interna para consultar, copiar y documentar soluciones frecuentes de Soporte IT.

Funciona como web local con Vite, como app de escritorio con Electron y también puede conectarse a una base compartida gratuita usando Supabase.

## Funcionalidades

- Búsqueda por título, categoría, síntomas, pasos, comandos y notas.
- Filtro por categoría y por soluciones con PowerShell.
- Modo claro/oscuro persistente.
- Fichas con síntomas, causas, pasos, comandos, mensaje al usuario y notas internas.
- Cada comando muestra una sección de `Descripción` con el objetivo del comando.
- Alta de nuevas soluciones desde la interfaz.
- Persistencia local por defecto y persistencia compartida opcional con Supabase.
- Copia rápida de comandos, mensajes o ficha completa.

## Desarrollo

```bash
npm install
npm run dev
```

Luego abrir:

```text
http://127.0.0.1:5173
```

## Escritorio

Modo desarrollo con Electron:

```bash
npm run desktop:dev
```

Modo escritorio local:

```bash
npm run desktop
```

Generar instalador y portable:

```bash
npm run dist
```

Generar solo portable:

```bash
npm run dist:portable
```

Los archivos quedan en `release/`.

La configuración usa Electron Builder con:

- `nsis.perMachine: false`
- instalador por usuario
- portable para ejecutar sin instalación

Esto evita requerir permisos de administrador mientras la política de Windows permita ejecutar aplicaciones de usuario.

## Base compartida gratuita

Por defecto, las soluciones nuevas se guardan en `localStorage`. Para que varias personas usen y modifiquen la misma base, configurar Supabase.

Crear una tabla `solutions`:

```sql
create table public.solutions (
  id text primary key,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Variables de entorno:

```env
VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU_ANON_KEY
VITE_SUPABASE_TABLE=solutions
```

Con esas variables, la app lee y guarda soluciones en Supabase. Si Supabase no responde, usa la copia local como fallback.

Para producción conviene configurar políticas RLS según el uso real. Para una herramienta interna simple se puede empezar restringiendo la API key al equipo/grupo que vaya a usar la app.

## Estructura

- `src/data/baseSolutions.js`: soluciones base incluidas en la app.
- `src/data/catalog.js`: normalización, búsqueda, categorías y descripción automática de comandos.
- `src/services/solutionsRepository.js`: persistencia local o Supabase.
- `src/components/SolutionCard.jsx`: visualización de fichas.
- `src/components/SolutionForm.jsx`: alta de nuevas soluciones.
- `electron/main.cjs`: entrada de Electron.

## Calidad

```bash
npm run lint
npm run build
```
