import { useEffect, useMemo, useState } from "react";
import { DEFAULT_CATEGORY, VIEWS } from "../config/appConfig";
import {
  createSolutionIndex,
  filterSolutions,
  getCategories,
  getFirstMatchingSolution,
  solutions,
} from "../data/catalog";
import {
  addUserSolution,
  deleteUserSolution,
  importUserSolutions,
  loadUserSolutions,
  publishSolutions,
  readSolutionHistory,
  updateUserSolution,
} from "../services/solutionsRepository";

const removeSearchIndex = (solution) => {
  const exportableSolution = { ...solution };
  delete exportableSolution.searchableText;
  return exportableSolution;
};

// Controla la base de conocimiento: filtros, seleccion, persistencia e historial.
export const useSolutionsCatalog = ({ authSession, showToast }) => {
  const [search, setSearch] = useState("");
  const [customSolutions, setCustomSolutions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY);
  const [onlyPowerShell, setOnlyPowerShell] = useState(false);
  const [repositoryMode, setRepositoryMode] = useState("local");
  const [history, setHistory] = useState([]);

  const solutionIndex = useMemo(
    () => createSolutionIndex([...solutions, ...customSolutions]),
    [customSolutions]
  );
  const categories = useMemo(() => getCategories(solutionIndex), [solutionIndex]);
  const [selected, setSelected] = useState(solutionIndex[0]);

  const filteredSolutions = useMemo(
    () =>
      filterSolutions({
        items: solutionIndex,
        search,
        category: selectedCategory,
        onlyPowerShell,
      }),
    [solutionIndex, search, selectedCategory, onlyPowerShell]
  );

  const applyRepositoryResult = (result) => {
    setCustomSolutions(result.items);
    setRepositoryMode(result.mode);
  };

  const syncSolutions = async () => {
    const result = await loadUserSolutions();
    applyRepositoryResult(result);
    showToast(
      result.mode === "shared"
        ? "Base compartida sincronizada"
        : "No se pudo sincronizar; usando copia local"
    );
  };

  useEffect(() => {
    if (!authSession?.access_token) return undefined;

    let isMounted = true;

    loadUserSolutions().then((result) => {
      if (!isMounted) return;

      applyRepositoryResult(result);
      if (result.mode === "shared") showToast("Base compartida sincronizada");
    });

    return () => {
      isMounted = false;
    };
  }, [authSession?.access_token, showToast]);

  useEffect(() => {
    let isMounted = true;

    readSolutionHistory(selected?.id).then((rows) => {
      if (isMounted) setHistory(rows);
    });

    return () => {
      isMounted = false;
    };
  }, [selected?.id, repositoryMode]);

  const selectFirstMatchingSolution = (category, powershellOnly) => {
    const firstMatch = getFirstMatchingSolution({
      items: solutionIndex,
      category,
      onlyPowerShell: powershellOnly,
    });

    if (firstMatch) setSelected(firstMatch);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    selectFirstMatchingSolution(category, onlyPowerShell);
  };

  const handleOnlyPowerShell = () => {
    const newValue = !onlyPowerShell;
    setOnlyPowerShell(newValue);
    selectFirstMatchingSolution(selectedCategory, newValue);
  };

  const handleAddSolution = async (solution) => {
    const result = await addUserSolution(solution, customSolutions);

    applyRepositoryResult(result);
    setSelected(result.item);
    showToast("Solución guardada");
    return VIEWS.CATALOG;
  };

  const handleUpdateSolution = async (solution) => {
    const result = await updateUserSolution(solution, customSolutions);

    applyRepositoryResult(result);
    setSelected(result.item);
    showToast("Solución actualizada");
    return VIEWS.CATALOG;
  };

  const handleDeleteSelectedSolution = async () => {
    if (!selected || selected.source === "base") return null;

    const confirmed = window.confirm(
      `¿Eliminar la solución "${selected.title}" de la base compartida?`
    );

    if (!confirmed) return null;

    const result = await deleteUserSolution(selected, customSolutions);
    const nextSelected =
      getFirstMatchingSolution({
        items: createSolutionIndex([...solutions, ...result.items]),
        category: selectedCategory,
        onlyPowerShell,
      }) ?? solutions[0];

    applyRepositoryResult(result);
    setSelected(nextSelected);
    showToast("Solución eliminada");
    return VIEWS.CATALOG;
  };

  const handlePromoteSelected = async () => {
    if (!selected || selected.source === "base") return;

    const result = await publishSolutions([selected], customSolutions);
    applyRepositoryResult(result);
    setSelected(result.items.find((item) => item.id === selected.id) ?? selected);
    showToast("Solución publicada en la base compartida");
  };

  const handlePublishBase = async () => {
    const result = await publishSolutions(solutions, customSolutions);
    applyRepositoryResult(result);
    showToast("Base inicial publicada en Supabase");
  };

  const handleExport = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      solutions: solutionIndex.map(removeSearchIndex),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `soporte-toolkit-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Exportación generada");
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const parsed = JSON.parse(await file.text());
      const items = Array.isArray(parsed) ? parsed : parsed.solutions;

      if (!Array.isArray(items)) throw new Error("Formato inválido");

      const result = await importUserSolutions(items, customSolutions);
      applyRepositoryResult(result);
      showToast(`${items.length} solución(es) importadas`);
    } catch {
      showToast("No se pudo importar el archivo");
    } finally {
      event.target.value = "";
    }
  };

  const resetAfterSignOut = () => {
    setCustomSolutions([]);
    setHistory([]);
    setRepositoryMode("local");
  };

  return {
    categories,
    filteredSolutions,
    handleAddSolution,
    handleCategoryChange,
    handleDeleteSelectedSolution,
    handleExport,
    handleImport,
    handleOnlyPowerShell,
    handlePromoteSelected,
    handlePublishBase,
    handleUpdateSolution,
    history,
    onlyPowerShell,
    repositoryMode,
    resetAfterSignOut,
    search,
    selected,
    selectedCategory,
    setSearch,
    setSelected,
    setSelectedCategory,
    solutionIndex,
    syncSolutions,
  };
};
