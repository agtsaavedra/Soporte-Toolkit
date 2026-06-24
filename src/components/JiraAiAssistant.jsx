import { useMemo, useState } from "react";
import {
  buildHelpdeskAiPrompt,
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
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const prompt = useMemo(
    () => buildHelpdeskAiPrompt({ ticket, suggestions, question }),
    [question, suggestions, ticket]
  );

  const askAssistant = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await requestAiAdvice({ prompt, ticket, question });
      setAnswer(result);
    } catch (requestError) {
      setError(
        `${requestError.message}. Configura un backend en /api/ai/helpdesk o VITE_AI_ASSISTANT_ENDPOINT. Mientras tanto podes copiar el prompt y pegarlo en ChatGPT.`
      );
    } finally {
      setIsLoading(false);
    }
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
        <button onClick={askAssistant} disabled={isLoading}>
          {isLoading ? "Consultando..." : "Consultar IA"}
        </button>
        <button className="secondary-action" onClick={() => copyText(prompt)}>
          Copiar prompt
        </button>
      </div>

      {error && <p className="jira-ai-error">{error}</p>}

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
            La consulta usa el texto del ticket y las soluciones sugeridas. No envia
            credenciales ni tokens desde el frontend.
          </p>
        )}
      </div>
    </aside>
  );
};

export default JiraAiAssistant;
