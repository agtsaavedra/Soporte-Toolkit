import { useMemo, useState } from "react";
import {
  buildHelpdeskAiPrompt,
  getAiAssistantEndpoint,
  requestAiAdvice,
} from "../services/aiAssistantService";
import "../styles/jira-ai-assistant.css";

const DEFAULT_QUESTION =
  "Analiza el requerimiento, elegi la mejor solucion sugerida y dame acciones tecnicas concretas.";

const copyText = async (text) => {
  await navigator.clipboard.writeText(text);
};

const JiraAiAssistant = ({ ticket, suggestions }) => {
  const [question, setQuestion] = useState(DEFAULT_QUESTION);
  const [answer, setAnswer] = useState("");
  const [notice, setNotice] = useState("");
  const [isPromptVisible, setIsPromptVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const hasBuiltInAssistant = Boolean(window.soporteToolkit?.askAi);
  const hasBackendAssistant = hasBuiltInAssistant || Boolean(getAiAssistantEndpoint());

  const prompt = useMemo(
    () => buildHelpdeskAiPrompt({ ticket, suggestions, question }),
    [question, suggestions, ticket]
  );

  const askAssistant = async () => {
    setIsLoading(true);
    setNotice("");

    try {
      const result = await requestAiAdvice({ prompt, ticket, question });
      setAnswer(result);
    } catch (requestError) {
      setNotice(`${requestError.message}. La consulta quedo lista para copiar.`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyPrompt = async () => {
    await copyText(prompt);
    setNotice("Consulta lista copiada.");
  };

  return (
    <aside className="jira-ai-panel">
      <div className="jira-ai-heading">
        <div>
          <p className="eyebrow">Asistente IA</p>
          <h3>Consulta IA del ticket</h3>
        </div>
        <span>Beta</span>
      </div>

      {!hasBackendAssistant && (
        <p className="jira-ai-mode-note">
          Para consultar desde la app, configurar OPENAI_API_KEY en el entorno
          y reiniciar Electron. La consulta queda lista para revisar o copiar.
        </p>
      )}

      <textarea
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        rows={5}
        placeholder="Pedile a la IA que analice el ticket, compare soluciones o redacte una respuesta..."
      />

      <div className="jira-ai-actions">
        <button onClick={askAssistant} disabled={isLoading}>
          {isLoading ? "Consultando..." : "Consultar IA"}
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
            value={prompt}
            readOnly
            rows={12}
            onFocus={(event) => event.target.select()}
            aria-label="Consulta preparada para IA"
          />
        </div>
      )}

      <div className="jira-ai-answer">
        {answer ? (
          <>
            <div className="jira-ai-answer-top">
              <strong>Respuesta IA</strong>
              <button className="secondary-action" onClick={() => copyText(answer)}>
                Copiar
              </button>
            </div>
            <pre>{answer}</pre>
          </>
        ) : (
          <p>
            {hasBackendAssistant
              ? "La respuesta tecnica de la IA va a aparecer aca sin salir del ticket."
              : "Sin OPENAI_API_KEY, este panel deja la consulta preparada dentro del ticket para que puedas revisarla o copiarla."}
          </p>
        )}
      </div>
    </aside>
  );
};

export default JiraAiAssistant;
