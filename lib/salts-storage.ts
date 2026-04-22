/**
 * In-memory salt suggestions (stored in sessionStorage on client).
 * In production, consider storing these in localStorage or a separate DB table.
 */

const STORAGE_KEY = "medipro_salt_suggestions";

export function getSaltSuggestions(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : getDefaultSalts();
  } catch {
    return getDefaultSalts();
  }
}

export function addSaltSuggestion(salt: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getSaltSuggestions();
    const cleaned = salt.trim();
    if (cleaned && !current.includes(cleaned)) {
      const updated = [cleaned, ...current].slice(0, 50); // Keep most recent 50
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  } catch {
    // Silently fail if storage is unavailable
  }
}

function getDefaultSalts(): string[] {
  return [
    "Metformin HCl",
    "Imatinib 400mg",
    "Paracetamol 500mg",
    "Ibuprofen 400mg",
    "Amoxicillin 500mg",
    "Aspirin 75mg",
    "Omeprazole 20mg",
    "Atorvastatin 20mg",
    "Lisinopril 10mg",
    "Metoprolol 50mg",
    "Levothyroxine 50mcg",
  ];
}
