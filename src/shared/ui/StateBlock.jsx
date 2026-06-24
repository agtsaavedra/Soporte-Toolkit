import "../../styles/state-block.css";

export const LoadingState = ({ title = "Cargando", description = "Preparando informacion..." }) => (
  <div className="state-block state-loading" role="status">
    <span className="state-spinner" aria-hidden="true" />
    <div>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  </div>
);

export const EmptyState = ({ title = "Sin resultados", description }) => (
  <div className="state-block">
    <strong>{title}</strong>
    {description && <p>{description}</p>}
  </div>
);

export const ErrorState = ({ title = "Ocurrio un error", description }) => (
  <div className="state-block state-error" role="alert">
    <strong>{title}</strong>
    {description && <p>{description}</p>}
  </div>
);
