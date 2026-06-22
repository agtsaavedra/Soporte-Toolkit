const EXACT_BOOST_TERMS = [
  "agserver",
  "sap",
  "forticlient",
  "outlook",
  "wps",
  "power bi",
  "impresora",
  "impresoras",
  "scanner",
  "debmedia",
  "roots",
  "proserlink",
];

export const normalizeText = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es-AR");

const includesAny = (text, values = []) =>
  values.some((value) => {
    const normalized = normalizeText(value);
    return normalized && text.includes(normalized);
  });

const fieldScore = (text, values = [], points) =>
  values.reduce((score, value) => {
    const normalized = normalizeText(value);
    return normalized && text.includes(normalized) ? score + points : score;
  }, 0);

const solutionText = (solution) =>
  normalizeText(
    [
      solution.title,
      solution.category,
      ...solution.tags,
      ...solution.symptoms,
      ...solution.causes,
      ...solution.steps,
      ...solution.commands.map((command) => command.command),
      ...solution.commands.map((command) => command.description),
      solution.userMessage,
      solution.internalNotes,
    ].join(" ")
  );

export const scoreSolutionsForIssue = (issue, solutions) => {
  const issueText = normalizeText(issue.plainText || "");
  const issueTitle = normalizeText(`${issue.key} ${issue.summary}`);

  return solutions
    .map((solution) => {
      const title = normalizeText(solution.title);
      const category = normalizeText(solution.category);
      const combinedSolutionText = solutionText(solution);
      let score = 0;
      const reasons = [];

      if (title && issueText.includes(title)) {
        score += 20;
        reasons.push("titulo exacto");
      }

      if (includesAny(issueTitle, solution.jiraKeywords)) {
        score += 18;
        reasons.push("keyword en resumen");
      }

      const keywordScore = fieldScore(issueText, solution.jiraKeywords, 15);
      if (keywordScore > 0) {
        score += keywordScore;
        reasons.push("keywords Jira");
      }

      const tagScore = fieldScore(issueText, solution.tags, 10);
      if (tagScore > 0) {
        score += tagScore;
        reasons.push("tags");
      }

      if (category && normalizeText(issue.detectedCategory).includes(category)) {
        score += 6;
        reasons.push("categoria detectada");
      }

      [solution.symptoms, solution.causes, solution.steps].forEach((values) => {
        const partial = fieldScore(issueText, values, 2);
        if (partial > 0) score += partial;
      });

      const commandScore = fieldScore(
        issueText,
        solution.commands.flatMap((command) => [command.command, command.description]),
        1
      );
      if (commandScore > 0) score += commandScore;

      EXACT_BOOST_TERMS.forEach((term) => {
        if (issueText.includes(term) && combinedSolutionText.includes(term)) {
          score += 12;
          reasons.push(`coincidencia ${term}`);
        }
      });

      if (solution.internalOnly && !issueText.includes("interno")) score -= 8;
      if (solution.requiresApproval && issueText.includes("urgente")) score -= 3;

      return { solution, score, reasons: [...new Set(reasons)] };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
};

export const getSuggestedSolutions = (issue, solutions, limit = 5) =>
  scoreSolutionsForIssue(issue, solutions).slice(0, limit);
