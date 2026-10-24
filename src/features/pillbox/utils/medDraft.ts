import type { TFunction } from "i18next";

import { pillSwatches } from "@/design-system/tokens";
import type { Med, PillDesign } from "@/domain/med";

import type { MedToUpdate } from "@/features/pillbox/queries/updateMed";
import type { Language } from "@/shared/i18n/resources";

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

export function createMedDraft(
  t: TFunction<"pillbox">,
  origin: MedFlowOrigin,
  med?: Med,
): MedDraft {
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
    detail: origin === "asNeeded" ? t("Si besoin") : "",
    design: DEFAULT_PILL_DESIGN,
  };
}

function capitalizeFirstLetter(text: string, language: Language): string {
  return text.charAt(0).toLocaleUpperCase(language) + text.slice(1);
}

export function toMedValues(draft: MedDraft, language: Language): Omit<MedToUpdate, "id"> {
  return {
    name: capitalizeFirstLetter(draft.name.trim(), language),
    strength: draft.strength.trim(),
    detail: draft.detail.trim(),
    design: draft.design,
  };
}
