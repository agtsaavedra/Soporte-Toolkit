import { useState } from "react";
import { normalizeCommand, normalizeSolution } from "../data/catalog";
import "../styles/features/solutions/form.css";

const emptyCommand = { command: "", description: "" };

const splitLines = (value) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const splitTags = (value) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const commandsToText = (commands = []) =>
  commands.map((command) => (typeof command === "string" ? command : command.command)).join("\n");

const initialForm = {
  title: "",
  category: "",
  intent: "",
  product: "",
  tags: "",
  risk: "Bajo",
  time: "10-20 min",
  powershell: true,
  requiresApproval: false,
  internalOnly: false,
  licenseRequired: false,
  officialDownloadUrl: "",
  internalDownloadPath: "",
  installerFile: "",
  installerNotes: "",
  installCommands: "",
  verificationSteps: "",
  symptoms: "",
  causes: "",
  steps: "",
  commands: [emptyCommand],
  jiraKeywords: "",
  userMessage: "",
  jiraTemplate: "",
  internalNotes: "",
};

const solutionToForm = (solution) => {
  if (!solution) return initialForm;

  return {
    title: solution.title,
    category: solution.category,
    intent: solution.intent,
    product: solution.product,
    tags: solution.tags.join(", "),
    risk: solution.risk,
    time: solution.time,
    powershell: solution.powershell,
    requiresApproval: solution.requiresApproval,
    internalOnly: solution.internalOnly,
    licenseRequired: solution.licenseRequired,
    officialDownloadUrl: solution.officialDownloadUrl,
    internalDownloadPath: solution.internalDownloadPath,
    installerFile: solution.installerFile,
    installerNotes: solution.installerNotes,
    installCommands: commandsToText(solution.installCommands),
    verificationSteps: solution.verificationSteps.join("\n"),
    symptoms: solution.symptoms.join("\n"),
    causes: solution.causes.join("\n"),
    steps: solution.steps.join("\n"),
    commands: solution.commands.length > 0 ? solution.commands : [emptyCommand],
    jiraKeywords: solution.jiraKeywords.join(", "),
    userMessage: solution.userMessage,
    jiraTemplate: solution.jiraTemplate,
    internalNotes: solution.internalNotes,
  };
};

const SolutionForm = ({ initialSolution, onCancel, onSubmit }) => {
  const [form, setForm] = useState(() => solutionToForm(initialSolution));
  const isEditing = Boolean(initialSolution);

  const updateField = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const updateCommand = (index, field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      commands: currentForm.commands.map((command, commandIndex) =>
        commandIndex === index ? { ...command, [field]: value } : command
      ),
    }));
  };

  const addCommand = () => {
    setForm((currentForm) => ({
      ...currentForm,
      commands: [...currentForm.commands, { ...emptyCommand }],
    }));
  };

  const removeCommand = (index) => {
    setForm((currentForm) => ({
      ...currentForm,
      commands:
        currentForm.commands.length === 1
          ? [{ ...emptyCommand }]
          : currentForm.commands.filter((_, commandIndex) => commandIndex !== index),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const solution = normalizeSolution({
      id: initialSolution?.id ?? `custom-${Date.now()}`,
      title: form.title,
      category: form.category || "General",
      intent: form.intent,
      product: form.product,
      tags: splitTags(form.tags),
      risk: form.risk,
      time: form.time,
      powershell: form.powershell,
      requiresApproval: form.requiresApproval,
      internalOnly: form.internalOnly,
      licenseRequired: form.licenseRequired,
      officialDownloadUrl: form.officialDownloadUrl,
      internalDownloadPath: form.internalDownloadPath,
      installerFile: form.installerFile,
      installerNotes: form.installerNotes,
      installCommands: splitLines(form.installCommands),
      verificationSteps: splitLines(form.verificationSteps),
      symptoms: splitLines(form.symptoms),
      causes: splitLines(form.causes),
      steps: splitLines(form.steps),
      commands: form.commands
        .filter((command) => command.command.trim())
        .map(normalizeCommand),
      jiraKeywords: splitTags(form.jiraKeywords),
      userMessage: form.userMessage,
      jiraTemplate: form.jiraTemplate,
      internalNotes: form.internalNotes,
      source: initialSolution?.source ?? "custom",
    });

    onSubmit(solution);
    if (!isEditing) setForm(initialForm);
  };

  return (
    <form className="solution-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          Titulo
          <input
            required
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="Ej: Power BI Desktop no instalado"
          />
        </label>

        <label>
          Categoria
          <input
            required
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
            placeholder="Ej: Instalacion de software"
          />
        </label>

        <label>
          Intent
          <input
            value={form.intent}
            onChange={(event) => updateField("intent", event.target.value)}
            placeholder="Ej: POWER_BI"
          />
        </label>

        <label>
          Producto
          <input
            value={form.product}
            onChange={(event) => updateField("product", event.target.value)}
            placeholder="Ej: Power BI Desktop"
          />
        </label>

        <label>
          Riesgo
          <select
            value={form.risk}
            onChange={(event) => updateField("risk", event.target.value)}
          >
            <option>Bajo</option>
            <option>Medio</option>
            <option>Alto</option>
          </select>
        </label>

        <label>
          Tiempo estimado
          <input
            value={form.time}
            onChange={(event) => updateField("time", event.target.value)}
            placeholder="10-20 min"
          />
        </label>
      </div>

      <label>
        Tags separados por coma
        <input
          value={form.tags}
          onChange={(event) => updateField("tags", event.target.value)}
          placeholder="Power BI, Microsoft, instalacion"
        />
      </label>

      <div className="checkbox-grid">
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.powershell}
            onChange={(event) => updateField("powershell", event.target.checked)}
          />
          Incluye PowerShell
        </label>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.requiresApproval}
            onChange={(event) => updateField("requiresApproval", event.target.checked)}
          />
          Requiere aprobacion
        </label>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.licenseRequired}
            onChange={(event) => updateField("licenseRequired", event.target.checked)}
          />
          Requiere licencia
        </label>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.internalOnly}
            onChange={(event) => updateField("internalOnly", event.target.checked)}
          />
          Solo interno
        </label>
      </div>

      <div className="form-grid">
        <label>
          Descarga oficial
          <input
            value={form.officialDownloadUrl}
            onChange={(event) => updateField("officialDownloadUrl", event.target.value)}
            placeholder="https://..."
          />
        </label>

        <label>
          Ruta interna
          <input
            value={form.internalDownloadPath}
            onChange={(event) => updateField("internalDownloadPath", event.target.value)}
            placeholder="[RUTA_INTERNA]/Software"
          />
        </label>

        <label>
          Instalador esperado
          <input
            value={form.installerFile}
            onChange={(event) => updateField("installerFile", event.target.value)}
            placeholder="setup.exe"
          />
        </label>

        <label>
          Notas de instalacion
          <input
            value={form.installerNotes}
            onChange={(event) => updateField("installerNotes", event.target.value)}
            placeholder="Detalle operativo de instalacion"
          />
        </label>
      </div>

      <label>
        Comandos de instalacion, uno por linea
        <textarea
          value={form.installCommands}
          onChange={(event) => updateField("installCommands", event.target.value)}
        />
      </label>

      <label>
        Pasos de validacion, uno por linea
        <textarea
          value={form.verificationSteps}
          onChange={(event) => updateField("verificationSteps", event.target.value)}
        />
      </label>

      <div className="form-grid">
        <label>
          Sintomas, uno por linea
          <textarea
            required
            value={form.symptoms}
            onChange={(event) => updateField("symptoms", event.target.value)}
          />
        </label>

        <label>
          Causas posibles, una por linea
          <textarea
            required
            value={form.causes}
            onChange={(event) => updateField("causes", event.target.value)}
          />
        </label>
      </div>

      <label>
        Pasos sugeridos, uno por linea
        <textarea
          required
          value={form.steps}
          onChange={(event) => updateField("steps", event.target.value)}
        />
      </label>

      <div className="command-editor">
        <div className="command-editor-title">
          <h3>Comandos</h3>
          <button type="button" onClick={addCommand}>
            Agregar comando
          </button>
        </div>

        {form.commands.map((command, index) => (
          <div className="command-editor-row" key={index}>
            <input
              value={command.command}
              onChange={(event) =>
                updateCommand(index, "command", event.target.value)
              }
              placeholder="Comando"
            />
            <input
              value={command.description}
              onChange={(event) =>
                updateCommand(index, "description", event.target.value)
              }
              placeholder="Descripcion del comando"
            />
            <button type="button" onClick={() => removeCommand(index)}>
              Quitar
            </button>
          </div>
        ))}
      </div>

      <label>
        Keywords Jira separados por coma
        <input
          value={form.jiraKeywords}
          onChange={(event) => updateField("jiraKeywords", event.target.value)}
          placeholder="power bi, pbix, instalar power bi"
        />
      </label>

      <label>
        Mensaje interno de usuario
        <textarea
          value={form.userMessage}
          onChange={(event) => updateField("userMessage", event.target.value)}
        />
      </label>

      <label>
        Template Jira
        <textarea
          value={form.jiraTemplate}
          onChange={(event) => updateField("jiraTemplate", event.target.value)}
        />
      </label>

      <label>
        Notas internas
        <textarea
          value={form.internalNotes}
          onChange={(event) => updateField("internalNotes", event.target.value)}
        />
      </label>

      <div className="form-actions">
        {onCancel && (
          <button className="cancel-solution" type="button" onClick={onCancel}>
            Cancelar
          </button>
        )}
        <button className="submit-solution" type="submit">
          {isEditing ? "Guardar cambios" : "Guardar solucion"}
        </button>
      </div>
    </form>
  );
};

export default SolutionForm;
