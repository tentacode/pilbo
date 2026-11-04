import type { Med } from "@/domain/med";
import { database } from "@/shared/database/database";

import { findDuplicateMed } from "@/features/pillbox/queries/findDuplicateMed";
import { getMedById } from "@/features/pillbox/queries/getMedById";
import { insertMed } from "@/features/pillbox/queries/insertMed";
import { updateMed } from "@/features/pillbox/queries/updateMed";
import { type MedDraft, toMedValues } from "@/features/pillbox/utils/medDraft";
import { rescheduleAfterChange } from "./useIntakeActions";
import { useLanguage } from "@/shared/i18n/hooks/useLanguage";
import type { Language } from "@/shared/i18n/resources";

export type MedSaveResult = { status: "saved"; med: Med } | { status: "duplicate"; duplicate: Med };

function saveMed(draft: MedDraft, language: Language): MedSaveResult {
  const values = toMedValues(draft, language);
  const duplicate = findDuplicateMed(database, { ...values, excludedMedId: draft.medId });
  if (duplicate !== undefined) {
    return { status: "duplicate", duplicate };
  }
  if (draft.medId === undefined) {
    return { status: "saved", med: insertMed(database, values) };
  }
  updateMed(database, { id: draft.medId, ...values });
  rescheduleAfterChange();
  return { status: "saved", med: getMedById(database, draft.medId) as Med };
}

export function useMedActions() {
  const language = useLanguage();
  return {
    getById: (medId: string) => getMedById(database, medId),
    save: (draft: MedDraft) => saveMed(draft, language),
  };
}
