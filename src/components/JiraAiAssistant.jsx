import { useMemo, useState } from "react";
import {
  buildHelpdeskAiPrompt,
  getAiAssistantEndpoint,
  requestAiAdvice,
} from "../services/aiAssistantService";
import "../styles/jira-ai-assistant.css";

const DEFAULT_QUESTION =
  "Analiza el requerimiento, elegi la mejor solucion sugerida y redacta una respuesta Jira concreta.";

const copyText = async (text) => {
  await navigator.clipboard.writeText(text);
};

const JiraAiAssistant = ({ ticket, suggestions }) => {
  const [question, setQuestion] = useState(DEFAULT_QUESTION);
  const [answer, setAnswer] = useState("");
  const [notice, setNotice] = useState("");
  const [isPromptVisible, setIsPromptVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const hasBackendAssistant = Boolean(getAiAssistantEndpoint());

  const prompt = useMemo(
    () => buildHelpdeskAiPrompt({ ticket, suggestions, question }),
    [question, suggestions, ticket]
  );

  const askAssistant = async () => {
    if (!hasBackendAssistant) return;

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
    setNotice("Consulta lista copiada. Pegala en ChatGPT cuando quieras usarla.");
  };

  const openChatGpt = async () => {
    await copyText(prompt);
    setNotice("Consulta copiada. Se abrio ChatGPT como accion opcional.");

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
          <h3>Consulta con ChatGPT</h3>
        </div>
        <span>Beta</span>
      </div>

      {!hasBackendAssistant && (
        <p className="jira-ai-mode-note">
          La consulta se arma dentro del ticket. Copiala cuando quieras usar
          ChatGPT; no se abre ninguna ventana automaticamente.
        </p>
      )}

      <textarea
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        rows={5}
        placeholder="Pedile a la IA que analice el ticket, compare soluciones o redacte una respuesta..."
      />

      <div className="jira-ai-actions">
        {hasBackendAssistant && (
          <button onClick={askAssistant} disabled={isLoading}>
            {isLoading ? "Consultando..." : "Consultar IA"}
          </button>
        )}
        <button onClick={copyPrompt}>
          Copiar consulta lista
        </button>
        <button
          className="secondary-action"
          onClick={() => setIsPromptVisible((currentValue) => !currentValue)}
        >
          {isPromptVisible ? "Ocultar consulta" : "Ver consulta"}
        </button>
        <button className="secondary-action" onClick={openChatGpt}>
          Abrir ChatGPT
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
            aria-label="Consulta preparada para ChatGPT"
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
              ? "Si configuras un backend IA, la respuesta va a aparecer aca."
              : "Sin backend IA activo, este panel funciona como preparador profesional de consulta: revisas, copias y pegas en ChatGPT sin perder el contexto del ticket."}
          </p>
        )}
      </div>
    </aside>
  );
};

export default JiraAiAssistant;
