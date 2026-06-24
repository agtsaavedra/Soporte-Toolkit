import { useState } from "react";
import { normalizeCommand, normalizeSolution } from "../data/catalog";
import "../styles/solution-form.css";

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

const initialForm = {
  title: "",
  category: "",
  tags: "",
  risk: "Bajo",
  time: "10-20 min",
  powershell: true,
  symptoms: "",
  causes: "",
  steps: "",
  commands: [emptyCommand],
  internalNotes: "",
};

const solutionToForm = (solution) => {
  if (!solution) return initialForm;

  return {
    title: solution.title,
    category: solution.category,
    tags: solution.tags.join(", "),
    risk: solution.risk,
    time: solution.time,
    powershell: solution.powershell,
    symptoms: solution.symptoms.join("\n"),
    causes: solution.causes.join("\n"),
    steps: solution.steps.join("\n"),
    commands: solution.commands.length > 0 ? solution.commands : [emptyCommand],
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
      tags: splitTags(form.tags),
      risk: form.risk,
      time: form.time,
      powershell: form.powershell,
      symptoms: splitLines(form.symptoms),
      causes: splitLines(form.causes),
      steps: splitLines(form.steps),
      commands: form.commands
        .filter((command) => command.command.trim())
        .map(normalizeCommand),
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
          Título
          <input
            required
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="Ej: Teams no inicia sesión"
          />
        </label>

        <label>
          Categoría
          <input
            required
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
            placeholder="Ej: Microsoft 365"
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
          placeholder="Teams, Office, Login"
        />
      </label>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={form.powershell}
          onChange={(event) => updateField("powershell", event.target.checked)}
        />
        Incluye PowerShell
      </label>

      <div className="form-grid">
        <label>
          Síntomas, uno por línea
          <textarea
            required
            value={form.symptoms}
            onChange={(event) => updateField("symptoms", event.target.value)}
          />
        </label>

        <label>
          Causas posibles, una por línea
          <textarea
            required
            value={form.causes}
            onChange={(event) => updateField("causes", event.target.value)}
          />
        </label>
      </div>

      <label>
        Pasos sugeridos, uno por línea
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
              placeholder="Descripción del comando"
            />
            <button type="button" onClick={() => removeCommand(index)}>
              Quitar
            </button>
          </div>
        ))}
      </div>

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
          {isEditing ? "Guardar cambios" : "Guardar solución"}
        </button>
      </div>
    </form>
  );
};

export default SolutionForm;
