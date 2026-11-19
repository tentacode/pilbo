export type PillShape =
  | "round"
  | "oval"
  | "capsule"
  | "softgel"
  | "triangle"
  | "square"
  | "sachet"
  | "tube"
  | "syrup"
  | "drops";

export type PillSize = "small" | "medium" | "large";

export type PillDesign = {
  shape: PillShape;
  size: PillSize;
  colors: [string, string];
};

type PillShapeConfiguration = {
  hasScoreLine: boolean;
  hasWhiteContainer: boolean;
};

export const PILL_SHAPES: Record<PillShape, PillShapeConfiguration> = {
  round: { hasScoreLine: true, hasWhiteContainer: false },
  oval: { hasScoreLine: true, hasWhiteContainer: false },
  capsule: { hasScoreLine: false, hasWhiteContainer: false },
  softgel: { hasScoreLine: false, hasWhiteContainer: false },
  triangle: { hasScoreLine: false, hasWhiteContainer: false },
  square: { hasScoreLine: false, hasWhiteContainer: false },
  sachet: { hasScoreLine: false, hasWhiteContainer: false },
  tube: { hasScoreLine: false, hasWhiteContainer: false },
  syrup: { hasScoreLine: false, hasWhiteContainer: true },
  drops: { hasScoreLine: false, hasWhiteContainer: true },
};

export interface Med {
  id: string;
  name: string;
  strength: string;
  detail: string;
  design: PillDesign;
}

export interface MedQuantity {
  med: Med;
  quantity: number;
}

const LOCALE = "fr";

function compareText(first: string, second: string): number {
  return first.localeCompare(second, LOCALE, { numeric: true, sensitivity: "base" });
}

const LEADING_NUMBER = /^\s*(\d+(?:[.,]\d+)?)/;

function leadingNumberOf(text: string): number | undefined {
  const match = LEADING_NUMBER.exec(text);
  return match === null ? undefined : Number(match[1].replace(",", "."));
}

function compareStrengths(first: string, second: string): number {
  const firstNumber = leadingNumberOf(first);
  const secondNumber = leadingNumberOf(second);
  const numberOrder =
    firstNumber === undefined || secondNumber === undefined ? 0 : firstNumber - secondNumber;
  return numberOrder || compareText(first, second);
}

export function compareMeds(first: Med, second: Med): number {
  return compareText(first.name, second.name) || compareStrengths(first.strength, second.strength);
}

export function sortMedQuantities(medQuantities: MedQuantity[]): MedQuantity[] {
  return [...medQuantities].sort((first, second) => compareMeds(first.med, second.med));
}

export function formatMedLabel({ name, strength }: Pick<Med, "name" | "strength">): string {
  return strength === "" ? name : `${name} ${strength}`;
}
