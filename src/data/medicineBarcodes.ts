// Prototype barcode-to-medicine mapping used by the in-app scanner.
// In production this should be backed by a verified medication barcode database.
export const MEDICINE_BARCODE_MAP: Record<string, string> = {
  "036000291452": "Aspirin",
  "300067323603": "Metformin",
  "312547171763": "Lisinopril",
  "301220001121": "Atorvastatin",
  "041100005264": "Ibuprofen",
  "312843536534": "Amoxicillin",
  "307667123181": "Levothyroxine",
  "037000431256": "Omeprazole",
  "041167025016": "Cetirizine",
  "057800812345": "Losartan",
  "050428000112": "Sertraline",
  "305361999120": "Gabapentin",
  "301220770884": "Rosuvastatin",
  "049000006345": "Hydrochlorothiazide",
  "041100807452": "Naproxen",
  "312547115901": "Amlodipine",
  "042100009632": "Fluoxetine",
  "300742101223": "Warfarin",
  "050428114013": "Prednisone",
  "301220230441": "Metoprolol",
};

const normalizeBarcode = (value: string) => value.replace(/\D/g, "");

export const lookupMedicineByBarcode = (barcode: string): string | null => {
  const normalized = normalizeBarcode(barcode);
  if (!normalized) return null;

  const candidates = new Set<string>([normalized]);
  if (normalized.length === 13 && normalized.startsWith("0")) {
    candidates.add(normalized.slice(1));
  }
  if (normalized.length === 12) {
    candidates.add(`0${normalized}`);
  }

  for (const candidate of candidates) {
    const match = MEDICINE_BARCODE_MAP[candidate];
    if (match) return match;
  }

  const partialMatch = Object.entries(MEDICINE_BARCODE_MAP).find(
    ([stored]) => stored.endsWith(normalized) || normalized.endsWith(stored),
  );

  return partialMatch?.[1] ?? null;
};
