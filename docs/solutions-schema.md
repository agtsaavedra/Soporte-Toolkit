# Schema de soluciones

Cada ficha de solucion representa un procedimiento tecnico reutilizable.

Campos principales:

- `id`: identificador estable. Si no existe en importacion, la app genera uno.
- `title`: titulo visible de la ficha.
- `category`: agrupacion funcional para filtros.
- `intent`: intencion usada por el matcher de Jira.
- `product`: producto o sistema principal.
- `tags`: palabras cortas para busqueda.
- `risk`: `Bajo`, `Medio` o `Alto`.
- `time`: texto visible de duracion estimada.
- `estimatedMinutes`: numero para calculos futuros.
- `powershell`: indica si incluye comandos PowerShell.
- `resolutionType`: tipo tecnico de procedimiento.
- `requiresApproval`: marca si requiere autorizacion previa.
- `internalOnly`: marca contenido interno.
- `symptoms`: sintomas habituales.
- `causes`: causas posibles.
- `steps`: pasos sugeridos para el tecnico.
- `commands`: lista de comandos con `command` y `description`.
- `jiraKeywords`: terminos usados para sugerencias desde tickets Jira.
- `internalNotes`: notas internas para Mesa de Ayuda.

Reglas:

- `title` y `category` son obligatorios.
- Los campos de listas deben ser arrays.
- No guardar credenciales, tokens, passwords reales ni datos sensibles.
- No incluir respuestas al solicitante; la comunicacion final la define el tecnico.
