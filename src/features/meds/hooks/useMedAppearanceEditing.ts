import { useState } from "react";

import type { PillDesign } from "@/domain/med";
import { database } from "@/shared/database/database";

import { updateMedDesign } from "@/features/meds/queries/updateMedDesign";
import { getMedById } from "@/features/pillbox/queries/getMedById";

export function useMedAppearanceEditing(medId: string) {
  const [med] = useState(() => getMedById(database, medId));
  return {
    med,
    save: (design: PillDesign) => updateMedDesign(database, medId, design),
  };
}
