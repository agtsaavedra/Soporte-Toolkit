# Soporte Toolkit

Aplicacion interna para consultar soluciones frecuentes de Soporte IT, revisar tickets de Jira Help Desk y acelerar el diagnostico tecnico.

Funciona como app web local con Vite, como app de escritorio con Electron y puede sincronizar soluciones compartidas con Supabase.

## Funcionalidades

- Busqueda de soluciones por titulo, categoria, sintomas, pasos, comandos y notas.
- Filtros por categoria y por soluciones con PowerShell.
- Modo claro/oscuro persistente.
- Alta, edicion y eliminacion de soluciones.
- Importacion/exportacion JSON.
- Sincronizacion opcional con Supabase.
- Historial reciente de cambios por solucion.
- Login con Supabase Auth para registrar quien modifica.
- Vista `Jira Help Desk` con cache local, paginacion y sugerencias de solucion.
- Modal de ticket con resumen tecnico, acciones rapidas y consulta preparada para ChatGPT.

## Desarrollo

```bash
npm install
npm run dev
```

Luego abrir:

```text
http://127.0.0.1:5173
```

Modo desarrollo con Electron:

```bash
npm run desktop:dev
```

## Jira Help Desk live

La vista `Jira Help Desk` consulta:

```text
https://camuzzigas.atlassian.net/rest/api/3/search/jql
```

JQL usado:

```text
cf[10212]=11239 ORDER BY created DESC
```

La app no hardcodea tokens Jira en el frontend. En Electron se aprovecha la sesion abierta dentro de la app. En navegador, Jira Cloud puede bloquear llamadas directas por CORS; para web local con navegador se debe usar proxy/backend autorizado.

Flujo recomendado en Electron:

1. Ejecutar `npm run desktop:dev`.
2. Iniciar sesion en la app.
3. Abrir `Jira Help Desk`.
4. Usar `Verificar Jira` si hace falta abrir la sesion Jira.
5. Usar `Actualizar tickets`.
6. Abrir un ticket, revisar sugerencias y copiar comandos/pasos/link.

Los tickets se cachean en IndexedDB con ultima sync, cantidad y diff incremental. La primera carga trae 100 tickets y `Cargar mas` pagina de a 100.

## Asistente IA

El modal de ticket prepara una consulta tecnica con el contexto del requerimiento y las soluciones sugeridas.

No usa API paga de OpenAI ni guarda credenciales. Al usar `Abrir ChatGPT`, la consulta queda copiada al portapapeles y se abre ChatGPT para pegarla usando la sesion normal del navegador.

## Arquitectura

- `src/App.jsx`: composicion de alto nivel y seleccion de vista.
- `src/components`: componentes visuales principales.
- `src/hooks`: estado de dominio (`useAuthSession`, `useSolutionsCatalog`, `useJiraTickets`, `useTheme`, `useToast`).
- `src/config`: constantes compartidas de aplicacion y Jira.
- `src/data`: catalogo, normalizacion y schema de soluciones.
- `src/services`: integraciones, matching, Jira, Supabase y persistencia.
- `src/shared/ui`: componentes reutilizables de estado.
- `src/styles`: CSS separado por capas y feature. Ver `src/styles/README.md`.
- `electron`: entrada, preload y bridge de la app de escritorio.
- `supabase`: SQL de tablas, policies y triggers.

## Estructura de estilos

- `src/styles/base`: reset, variables y estilos globales.
- `src/styles/layout`: layout principal, sidebar, login y toast.
- `src/styles/features/jira`: Jira Help Desk, modal, sugerencias y asistente.
- `src/styles/features/solutions`: fichas y formularios de soluciones.
- `src/styles/shared`: estilos de componentes compartidos.

## Validaciones

Antes de publicar cambios:

```bash
npm run lint
npm test
npm run build
npm run test:matcher
```

## Escritorio

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

Los archivos quedan en `release/`. La configuracion usa Electron Builder por usuario (`nsis.perMachine: false`) para evitar permisos de administrador cuando la politica de Windows lo permita.

## Supabase

Por defecto, las soluciones nuevas pueden persistir localmente. Para una base compartida, configurar Supabase y ejecutar:

```text
supabase/schema.sql
```

Variables esperadas:

```env
VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU_ANON_KEY
VITE_SUPABASE_TABLE=solutions
VITE_AUTH_REDIRECT_URL=http://localhost:5173/auth/callback
```

El script actual permite leer y escribir soluciones solo con usuarios autenticados.
