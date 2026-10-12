export type PillSize = "small" | "medium" | "large";

export type PillDesign =
  | { shape: "round"; color: string; hasScoreLine: boolean; size: PillSize }
  | { shape: "oval"; color: string; size: PillSize }
  | { shape: "capsule"; firstHalfColor: string; secondHalfColor: string; size: PillSize };

export interface Med {
  id: string;
  name: string;
  strength: string;
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
