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
      setNotice(`${requestError.message}. Copie el prompt o abra ChatGPT para continuar.`);
    } finally {
      setIsLoading(false);
    }
  };

  const openChatGpt = async () => {
    await copyText(prompt);
    setNotice("Prompt copiado. Se abrio ChatGPT para pegarlo y consultar.");

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
        <button onClick={openChatGpt}>
          Abrir ChatGPT
        </button>
        <button className="secondary-action" onClick={() => copyText(prompt)}>
          Copiar prompt
        </button>
      </div>

      {notice && <p className="jira-ai-notice">{notice}</p>}

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
            El prompt incluye el ticket y las soluciones sugeridas. Usar Abrir
            ChatGPT copia el prompt y abre ChatGPT sin mostrar errores tecnicos.
          </p>
        )}
      </div>
    </aside>
  );
};

export default JiraAiAssistant;
