import type { Med } from "@/domain/med";
import { database } from "@/shared/database/database";

import { findDuplicateMed } from "@/features/pillbox/queries/findDuplicateMed";
import { getMedById } from "@/features/pillbox/queries/getMedById";
import { insertMed } from "@/features/pillbox/queries/insertMed";
import { setMedAsNeeded } from "@/features/pillbox/queries/setMedAsNeeded";
import { updateMed } from "@/features/pillbox/queries/updateMed";
import { type MedDraft, toMedValues } from "@/features/pillbox/utils/medDraft";
import { rescheduleAfterChange } from "./useIntakeActions";

export type MedSaveResult = { status: "saved"; med: Med } | { status: "duplicate"; duplicate: Med };

function saveMed(draft: MedDraft, isAsNeeded: boolean): MedSaveResult {
  const values = toMedValues(draft);
  const duplicate = findDuplicateMed(database, { ...values, excludedMedId: draft.medId });
  if (duplicate !== undefined) {
    return { status: "duplicate", duplicate };
  }
  if (draft.medId === undefined) {
    return { status: "saved", med: insertMed(database, { ...values, isAsNeeded }) };
  }
  updateMed(database, { id: draft.medId, ...values });
  rescheduleAfterChange();
  return { status: "saved", med: getMedById(database, draft.medId) as Med };
}

export function useMedActions() {
  return {
    getById: (medId: string) => getMedById(database, medId),
    save: saveMed,
    setAsNeeded: (medId: string, isAsNeeded: boolean) =>
      setMedAsNeeded(database, medId, isAsNeeded),
  };
}
