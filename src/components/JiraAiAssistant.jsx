import { useMemo, useState } from "react";
import { buildHelpdeskAiPrompt } from "../services/aiAssistantService";
import "../styles/features/jira/ai-assistant.css";

const DEFAULT_QUESTION =
  "Analizá el requerimiento, elegí la mejor solución sugerida y dame acciones técnicas concretas.";

const copyText = async (text) => {
  await navigator.clipboard.writeText(text);
};

const JiraAiAssistant = ({ ticket, suggestions }) => {
  const [question, setQuestion] = useState(DEFAULT_QUESTION);
  const [notice, setNotice] = useState("");
  const [isPromptVisible, setIsPromptVisible] = useState(false);

  const visiblePrompt = useMemo(
    () => (isPromptVisible ? buildHelpdeskAiPrompt({ ticket, suggestions, question }) : ""),
    [isPromptVisible, question, suggestions, ticket]
  );

  const copyPrompt = async () => {
    const prompt = buildHelpdeskAiPrompt({ ticket, suggestions, question });
    await copyText(prompt);
    setNotice("Consulta lista copiada.");
  };

  const openChatGpt = async () => {
    await copyPrompt();

    if (window.soporteToolkit?.openExternalUrl) {
      await window.soporteToolkit.openExternalUrl("https://chatgpt.com/");
      return;
    }

    window.open("https://chatgpt.com/", "_blank", "noreferrer");
  };

  return (
    <aside className="jira-ai-panel">
      <div className="jira-ai-heading">
        <div>
          <p className="eyebrow">Asistente IA</p>
          <h3>Consulta para ChatGPT</h3>
        </div>
        <span>Copiar y pegar</span>
      </div>

      <p className="jira-ai-mode-note">
        La app copia el contexto completo del ticket y abre ChatGPT. No usa API paga ni guarda credenciales.
      </p>

      <textarea
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        rows={5}
        placeholder="Pedile a la IA que analice el ticket, compare soluciones o proponga pasos técnicos..."
      />

      <div className="jira-ai-actions">
        <button onClick={openChatGpt}>
          Abrir ChatGPT
        </button>
        <button onClick={copyPrompt}>
          Copiar consulta lista
        </button>
        <button
          className="secondary-action"
          onClick={() => setIsPromptVisible((currentValue) => !currentValue)}
        >
          {isPromptVisible ? "Ocultar consulta" : "Ver consulta"}
        </button>
      </div>

      {notice && <p className="jira-ai-notice">{notice}</p>}

      {isPromptVisible && (
        <div className="jira-ai-prompt-box">
          <div className="jira-ai-prompt-top">
            <strong>Consulta preparada</strong>
            <small>Incluye ticket, comentarios y soluciones sugeridas.</small>
          </div>
          <textarea
            value={visiblePrompt}
            readOnly
            rows={12}
            onFocus={(event) => event.target.select()}
            aria-label="Consulta preparada para ChatGPT"
          />
        </div>
      )}

      <div className="jira-ai-answer">
        <p>
          Después de abrir ChatGPT, pegá la consulta copiada y pedí el análisis.
          El texto incluye descripción, comentarios recientes y soluciones sugeridas.
        </p>
      </div>
    </aside>
  );
};

export default JiraAiAssistant;
