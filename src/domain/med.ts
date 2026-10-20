export type PillShape = "round" | "oval" | "capsule" | "softgel";

export type PillSize = "small" | "medium" | "large";

export type PillDesign = {
  shape: PillShape;
  size: PillSize;
  colors: [string, string];
};

type PillShapeConfiguration = {
  hasScoreLine: boolean;
};

export const PILL_SHAPES: Record<PillShape, PillShapeConfiguration> = {
  round: { hasScoreLine: true },
  oval: { hasScoreLine: true },
  capsule: { hasScoreLine: false },
  softgel: { hasScoreLine: false },
};

export interface Med {
  id: string;
  name: string;
  strength: string;
  detail: string;
  design: PillDesign;
  isAsNeeded: boolean;
}

export interface MedQuantity {
  med: Med;
  quantity: number;
}

const LOCALE = "fr";

function compareText(first: string, second: string): number {
  return first.localeCompare(second, LOCALE, { numeric: true, sensitivity: "base" });
}

export function compareMeds(first: Med, second: Med): number {
  return compareText(first.name, second.name) || compareText(first.strength, second.strength);
}

export function formatMedLabel({ name, strength }: Pick<Med, "name" | "strength">): string {
  return strength === "" ? name : `${name} ${strength}`;
}
