export const HARMONIMED_MEDICATIONS_KEY = "harmonimed-medications";

export interface StoredMedication {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  time: string;
}

const isStoredMedication = (value: unknown): value is StoredMedication => {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.dose === "string" &&
    typeof item.frequency === "string" &&
    typeof item.time === "string"
  );
};

export const loadStoredMedications = (): StoredMedication[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HARMONIMED_MEDICATIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isStoredMedication);
  } catch {
    return [];
  }
};

export const saveStoredMedications = (medications: StoredMedication[]) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(HARMONIMED_MEDICATIONS_KEY, JSON.stringify(medications));
  } catch {
    // Ignore persistence errors in demo mode.
  }
};

export const getStoredMedicationNames = () =>
  loadStoredMedications()
    .map((med) => med.name.trim())
    .filter(Boolean);
