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
- Edición y eliminación de soluciones agregadas o compartidas.
- Sincronización manual con Supabase.
- Importación/exportación JSON.
- Publicación de la base inicial en Supabase.
- Historial reciente de cambios por solución.
- Login simple con Supabase Auth para registrar quién modifica.
- Persistencia local por defecto y persistencia compartida opcional con Supabase.
- Copia rápida de comandos, mensajes o ficha completa.

## Importar tickets de Jira

La app no guarda tokens ni credenciales de Jira. Por ahora trabaja con archivos JSON exportados previamente desde Jira Cloud.

Soporta exportaciones con forma:

```json
{ "issues": [] }
```

y tambien lotes paginados con `issues`, `nextPageToken` e `isLast`. Se pueden seleccionar varios archivos a la vez, por ejemplo `helpdesk_lote_0001.json`, `helpdesk_lote_0002.json`, etc. La app deduplica por `issue.key` y guarda los tickets importados en `localStorage` del equipo.

Flujo recomendado:

1. Entrar a la app.
2. Abrir la vista `Jira`.
3. Importar uno o varios JSON.
4. Filtrar o buscar el ticket.
5. Abrir el detalle, revisar sugerencias y copiar respuesta/comandos/plantilla.
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

Crear las tablas, triggers y policies ejecutando el contenido de:

- `supabase/schema.sql`

Variables de entorno:

```env
VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU_ANON_KEY
VITE_SUPABASE_TABLE=solutions
VITE_AUTH_REDIRECT_URL=http://localhost:5173/auth/callback
```

Para este proyecto local ya queda creada una base `.env.local` con la URL del proyecto. Falta completar `VITE_SUPABASE_ANON_KEY` con la anon public key de Supabase.

Con esas variables, la app lee y guarda soluciones en Supabase. Si Supabase no responde, usa la copia local como fallback. En el uso actual:

- Abrir la app: 1 lectura de la tabla `solutions`.
- Agregar una solución: 1 insert.
- Editar una solución: 1 upsert y 1 registro de historial.
- Eliminar una solución: 1 registro de historial y 1 delete.
- El buscador y los filtros no consultan Supabase; trabajan en memoria.

El script actual permite leer y escribir solo con usuarios autenticados.

## Autenticación

Para desarrollo local, lo más simple es desactivar confirmación de email en Supabase:

1. Authentication.
2. Sign In / Providers.
3. Email.
4. Desactivar `Confirm email`.

Con eso, al crear usuario desde la app ya queda habilitado.

Si querés mantener confirmación de email en desarrollo, configurar:

- Site URL: `http://localhost:5173`
- Redirect URLs:
  - `http://localhost:5173/auth/callback`
  - `http://127.0.0.1:5173/auth/callback`

Para producción web, usar una URL pública:

```env
VITE_AUTH_REDIRECT_URL=https://soporte-toolkit.tu-dominio.com/auth/callback
```

Para producción escritorio, la app registra el protocolo:

```text
soporte-toolkit://auth/callback
```

En Supabase se puede agregar como Redirect URL permitida. Al confirmar email, el sistema puede volver a abrir la app instalada usando ese protocolo.

## Estructura

- `src/data/baseSolutions.js`: soluciones base incluidas en la app.
- `src/data/helpDeskSolutions.js`: fichas iniciales ampliadas para Help Desk y plantillas Jira.
- `src/data/catalog.js`: normalización, búsqueda, categorías y descripción automática de comandos.
- `src/services/solutionsRepository.js`: persistencia local o Supabase.
- `src/services/jiraImportService.js`: parser de exportaciones Jira, ADF y persistencia local de tickets.
- `src/services/solutionMatcher.js`: scoring de tickets contra soluciones del toolkit.
- `src/components/SolutionCard.jsx`: visualización de fichas.
- `src/components/SolutionForm.jsx`: alta de nuevas soluciones.
- `electron/main.cjs`: entrada de Electron.

## Calidad

```bash
npm run lint
npm run build
```
