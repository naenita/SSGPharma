export type FaqEntry = {
  question: string;
  answer?: string;
};

export type ReferenceEntry = {
  label: string;
  url?: string;
};

function stripListMarker(value: string) {
  return value.replace(/^\s*(?:[-*•]+|\d+[.)]\s+)/, "").trim();
}

export function toParagraphs(text?: string | null) {
  if (!text) return [];

  return text
    .split(/\n\s*\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function parseListText(text?: string | null) {
  if (!text) return [];

  return text
    .split(/\r?\n|,/)
    .map((line) => stripListMarker(line))
    .filter(Boolean);
}

export function parseFaqText(text?: string | null): FaqEntry[] {
  if (!text) return [];

  const normalized = text
    .replace(/\r\n/g, "\n")
    .replace(/(?<=[.?!])\s*(?=[A-Z][^:\n]{2,}?\s*\?\s*::)/g, "\n\n")
    .replace(/::\s*(?=[A-Z][^:\n]{2,}?\s*\?\s*(?:\n|$))/g, "\n\n");

  return toParagraphs(normalized)
    .map((block) => {
      const inlineDelimiter = block.includes("::") ? "::" : block.includes("|") ? "|" : null;

      if (inlineDelimiter) {
        const [question, ...answerParts] = block.split(inlineDelimiter);
        const answer = answerParts.join(inlineDelimiter).trim();
        if (!question) return null;
        return {
          question: stripListMarker(question),
          answer: answer || undefined,
        };
      }

      const lines = block
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      if (lines.length === 0) return null;

      if (lines.length === 1) {
        const firstLine = lines[0];
        if (!firstLine) return null;
        return {
          question: stripListMarker(firstLine),
        };
      }

      const firstLine = lines[0];
      if (!firstLine) return null;
      return {
        question: stripListMarker(firstLine),
        answer: lines.slice(1).join(" ").trim() || undefined,
      };
    })
    .filter((entry): entry is FaqEntry => Boolean(entry?.question));
}

export function parseReferenceText(text?: string | null): ReferenceEntry[] {
  if (!text) return [];

  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const cleaned = stripListMarker(line);
      const inlineDelimiter = cleaned.includes("::") ? "::" : cleaned.includes("|") ? "|" : null;

      if (inlineDelimiter) {
        const [label, ...urlParts] = cleaned.split(inlineDelimiter);
        const url = urlParts.join(inlineDelimiter).trim();
        if (!label) {
          return {
            label: url,
            url: url || undefined,
          };
        }
        return {
          label: label.trim() || url,
          url: url || undefined,
        };
      }

      const urlMatch = cleaned.match(/https?:\/\/\S+/i);
      if (!urlMatch) {
        return { label: cleaned };
      }

      const url = urlMatch[0];
      const label = cleaned.replace(url, "").replace(/[-:]\s*$/, "").trim();

      return {
        label: label || url,
        url,
      };
    });
}

export function summarizeText(text?: string | null, maxLength = 160) {
  if (!text) return "";

  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;

  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

export function normalizeMatchToken(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
