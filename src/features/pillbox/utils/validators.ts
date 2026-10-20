import { selectedDaysOf, type IntakeDraft } from "./intakeDraft";
import type { MedDraft } from "./medDraft";

export const MINIMUM_MED_QUANTITY = 1;
export const MAXIMUM_MED_QUANTITY = 10;

export type IntakeDraftError = "missingMed" | "missingDay" | "invalidQuantity";

export function isValidMedQuantity(quantity: number): boolean {
  return (
    Number.isInteger(quantity) &&
    quantity >= MINIMUM_MED_QUANTITY &&
    quantity <= MAXIMUM_MED_QUANTITY
  );
}

export function validateIntakeDraft(draft: IntakeDraft): IntakeDraftError | null {
  if (draft.medQuantities.length === 0) {
    return "missingMed";
  }
  if (selectedDaysOf(draft).length === 0) {
    return "missingDay";
  }
  if (!draft.medQuantities.every(({ quantity }) => isValidMedQuantity(quantity))) {
    return "invalidQuantity";
  }
  return null;
}

export type MedDraftError = "missingName";

export function validateMedDraft(draft: MedDraft): MedDraftError | null {
  return draft.name.trim() === "" ? "missingName" : null;
}
