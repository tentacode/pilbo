import { pillSwatches } from "@/design-system/tokens";
import type { Med, PillDesign } from "@/domain/med";

import type { MedToUpdate } from "@/features/pillbox/queries/updateMed";

export type MedFlowOrigin = "intake" | "asNeeded";

export type MedDraft = {
  medId?: string;
  name: string;
  strength: string;
  detail: string;
  design: PillDesign;
};

export const DEFAULT_PILL_DESIGN: PillDesign = {
  shape: "round",
  size: "medium",
  colors: [pillSwatches.lilac, pillSwatches.lilac],
};

const AS_NEEDED_DEFAULT_DETAIL = "Si besoin";

export function createMedDraft(origin: MedFlowOrigin, med?: Med): MedDraft {
  if (med !== undefined) {
    return {
      medId: med.id,
      name: med.name,
      strength: med.strength,
      detail: med.detail,
      design: med.design,
    };
  }
  return {
    name: "",
    strength: "",
    detail: origin === "asNeeded" ? AS_NEEDED_DEFAULT_DETAIL : "",
    design: DEFAULT_PILL_DESIGN,
  };
}

const LOCALE = "fr";

function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toLocaleUpperCase(LOCALE) + text.slice(1);
}

export function toMedValues(draft: MedDraft): Omit<MedToUpdate, "id"> {
  return {
    name: capitalizeFirstLetter(draft.name.trim()),
    strength: draft.strength.trim(),
    detail: draft.detail.trim(),
    design: draft.design,
  };
}
