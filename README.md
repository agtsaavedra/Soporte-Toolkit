# Soporte Toolkit

Aplicación interna para consultar, copiar y documentar soluciones frecuentes de Soporte IT.

La app funciona como web local con Vite y también como aplicación de escritorio con Electron. No requiere permisos de administrador para ejecutarse: usa dependencias locales del proyecto y guarda las soluciones agregadas por el usuario en el almacenamiento local de la app.

## Funcionalidades

- Búsqueda por título, categoría, síntomas, pasos, comandos y notas.
- Filtro por categoría y por soluciones con PowerShell.
- Modo claro/oscuro persistente.
- Fichas con síntomas, causas, pasos, comandos, mensaje al usuario y notas internas.
- Cada comando incluye una descripción de qué hace.
- Alta de nuevas soluciones desde la interfaz, sin editar código.
- Copia rápida de comandos, mensajes o ficha completa.

## Estructura de datos

La entrada principal del catálogo está en:

- `src/data/catalog.js`

La base inicial de soluciones está en:

- `src/data/baseSolutions.js`

Las soluciones agregadas desde la app se guardan en `localStorage` con la clave:

- `support-toolkit-custom-solutions`

Formato recomendado de comandos:

```js
{
  command: "Get-Service Spooler",
  description: "Revisa el estado del servicio de impresión."
}
```

Las soluciones viejas con comandos como strings siguen funcionando porque `catalog.js` las normaliza automáticamente.

## Desarrollo web

```bash
npm install
npm run dev
```

Luego abrir:

```text
http://127.0.0.1:5173
```

## Aplicación de escritorio

Modo desarrollo con Electron:

```bash
npm run desktop:dev
```

Modo escritorio usando build local:

```bash
npm run desktop
```

Este modo primero genera `dist/` y luego abre la app con Electron. No instala servicios, no escribe en `Program Files` y no requiere permisos de administrador.

## Uso sin permisos de administrador

En una PC de usuario:

1. Instalar Node.js en modo usuario, si la organización lo permite.
2. Abrir una terminal en la carpeta del proyecto.
3. Ejecutar `npm install`.
4. Ejecutar `npm run desktop`.

Para distribuir un `.exe` portable real, el próximo paso sería agregar un empaquetador como `electron-builder` y generar un paquete portable por usuario. Eso tampoco debería requerir permisos de administrador para ejecutarse si se configura como portable o instalación per-user.

## Calidad

Comandos de verificación:

```bash
npm run lint
npm run build
```
