# Soporte Toolkit

Aplicación interna para consultar, copiar y documentar soluciones frecuentes de Soporte IT.

Funciona como web local con Vite, como app de escritorio con Electron y también puede conectarse a una base compartida gratuita usando Supabase.

## Funcionalidades

- Búsqueda por título, categoría, síntomas, pasos, comandos y notas.
- Filtro por categoría y por soluciones con PowerShell.
- Modo claro/oscuro persistente.
- Fichas con s�ntomas, causas, pasos, comandos y notas internas.
- Cada comando muestra una sección de `Descripción` con el objetivo del comando.
- Alta de nuevas soluciones desde la interfaz.
- Edición y eliminación de soluciones agregadas o compartidas.
- Sincronización manual con Supabase.
- Importación/exportación JSON.
- Publicación de la base inicial en Supabase.
- Historial reciente de cambios por solución.
- Login simple con Supabase Auth para registrar quién modifica.
- Persistencia local por defecto y persistencia compartida opcional con Supabase.
- Copia r�pida de comandos, pasos o ficha completa.

## Jira Help Desk live

La vista `Jira Help Desk` consulta Jira Cloud directamente contra:

```text
https://camuzzigas.atlassian.net/rest/api/3/search/jql
```

Usa el JQL:

```text
cf[10212]=11239 ORDER BY created DESC
```

No se guardan tokens ni credenciales en `.env`. El fetch usa `credentials: "include"` para aprovechar la sesion activa de Jira en el navegador.

En navegador web, Jira Cloud puede bloquear la llamada directa por CORS aunque la sesion este iniciada. Para usar la app como web local con Jira live, usar el proxy local:

```bash
npm run web:dev
```

El proxy lee credenciales solo del backend local (`.env.local`) y no las expone al frontend:

```env
JIRA_EMAIL=tu.email@camuzzigas.com.ar
JIRA_API_TOKEN=token_api_atlassian
```

Luego abrir:

```text
http://127.0.0.1:5173
```

Flujo recomendado:

1. Ejecutar `npm run web:dev` si se usa navegador, o `npm run desktop:dev` si se usa Electron.
2. Entrar a la app.
3. Abrir `Jira Help Desk`.
4. Usar `Actualizar tickets` para traer la primera tanda o tickets nuevos.
5. Usar `Cargar mas` para paginar de a 100.
6. Abrir un ticket, revisar sugerencias y copiar link, resumen, comandos o pasos.

Los tickets se cachean en IndexedDB con ultima sync, cantidad y diff incremental. Si ya hay cache, la app intenta traer solo tickets nuevos usando la fecha del ultimo ticket creado.

## Asistente IA en tickets

El modal de Jira incluye un panel `Asistente IA` para preparar una consulta tecnica con contexto del ticket y las soluciones sugeridas.

La app no usa API paga de OpenAI ni guarda credenciales. El flujo es:

1. Abrir el ticket.
2. Revisar o ajustar la consulta preparada.
3. Usar `Abrir ChatGPT`.
4. La consulta queda copiada al portapapeles y ChatGPT se abre en una ventana externa.
5. Pegar la consulta en ChatGPT y continuar el analisis.

Este enfoque aprovecha la sesion normal de ChatGPT y evita costos de API dentro de la app.

Para produccion web, Jira Cloud requiere backend/proxy con OAuth, API token de servicio o un flujo autorizado por Atlassian, manteniendo siempre las credenciales fuera del navegador.

## Desarrollo

```bash
npm install
npm run dev
```

Luego abrir:

```text
http://127.0.0.1:5173
```


## Arquitectura

- `src/App.jsx`: composicion de alto nivel y seleccion de vista.
- `src/hooks`: estado de dominio (`useAuthSession`, `useSolutionsCatalog`, `useJiraTickets`, `useTheme`, `useToast`).
- `src/components`: piezas visuales reutilizables.
- `src/config`: constantes compartidas de app y Jira.
- `src/data`: catalogo, normalizacion y schema de soluciones.
- `src/services`: integraciones externas y utilidades de persistencia.
- `src/shared/ui`: estados reutilizables como loading, error y empty.
- `src/styles`: CSS separado por responsabilidad.
- `.github/workflows/ci.yml`: validacion automatica en GitHub Actions.

Validaciones recomendadas antes de publicar cambios:

```bash
npm run lint
npm run build
npm test
npm run test:matcher
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
- `src/services/jiraService.js`: integracion live con Jira, normalizacion ADF, paginacion e IndexedDB.
- `src/services/solutionMatcher.js`: scoring de tickets contra soluciones del toolkit.
- `src/components/SolutionCard.jsx`: visualización de fichas.
- `src/components/SolutionForm.jsx`: alta de nuevas soluciones.
- `electron/main.cjs`: entrada de Electron.

## Calidad

```bash
npm run lint
npm run build
```


