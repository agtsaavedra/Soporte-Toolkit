import "../styles/jira-import.css";

const JiraImport = ({ onImport, onClear, ticketCount }) => (
  <section className="jira-import">
    <div>
      <p className="eyebrow">Jira Help Desk</p>
      <h2>Tickets importados</h2>
      <span>{ticketCount} ticket(s) guardados localmente</span>
    </div>

    <div className="jira-import-actions">
      <label className="jira-file-button">
        Importar JSON
        <input type="file" accept="application/json" multiple onChange={onImport} />
      </label>
      <button type="button" onClick={onClear} disabled={ticketCount === 0}>
        Limpiar
      </button>
    </div>
  </section>
);

export default JiraImport;
