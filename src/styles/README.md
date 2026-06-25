# Organización de estilos

Los estilos están separados por responsabilidad para que sea fácil ubicar cambios sin recorrer toda la app.

- `base/`: reset, variables y estilos globales. Se importan una sola vez desde `src/main.jsx`.
- `layout/`: estructura principal de la aplicación, login, sidebar y toast. El punto de entrada es `layout/app.css`.
- `features/jira/`: estilos propios de la vista Jira Help Desk, modal de ticket, sugerencias y asistente.
- `features/solutions/`: estilos de fichas y formularios de soluciones.
- `shared/`: componentes reutilizables que no pertenecen a una feature puntual.

Regla práctica: si un estilo pertenece a una pantalla o componente de negocio, debe vivir dentro de `features/`; si afecta a toda la app, debe vivir en `base/` o `layout/`.
