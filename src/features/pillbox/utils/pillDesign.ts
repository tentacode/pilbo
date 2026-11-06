import { pillSwatches } from "@/design-system/tokens";
import { PILL_SHAPES, type PillDesign, type PillShape, type PillSize } from "@/domain/med";

const PILL_SIZES: PillSize[] = ["small", "medium", "large"];

export function withShape(design: PillDesign, shape: PillShape): PillDesign {
  return { ...design, shape };
}

export function pillShapes(): PillShape[] {
  return Object.keys(PILL_SHAPES) as PillShape[];
}

export function pillSizes(): PillSize[] {
  return PILL_SIZES;
}

export function withColor(
  colors: PillDesign["colors"],
  half: 0 | 1,
  color: string,
): PillDesign["colors"] {
  return half === 0 ? [color, colors[1]] : [colors[0], color];
}

function pickRandom<Item>(items: readonly Item[], random: () => number): Item {
  return items[Math.floor(random() * items.length)];
}

function isSameDesign(first: PillDesign, second: PillDesign): boolean {
  return (
    first.shape === second.shape &&
    first.size === second.size &&
    first.colors[0] === second.colors[0] &&
    first.colors[1] === second.colors[1]
  );
}

export function randomPillDesign(
  current: PillDesign,
  random: () => number = Math.random,
): PillDesign {
  const swatchColors = Object.values(pillSwatches);
  const design: PillDesign = {
    shape: pickRandom(pillShapes(), random),
    size: pickRandom(PILL_SIZES, random),
    colors: [pickRandom(swatchColors, random), pickRandom(swatchColors, random)],
  };
  return isSameDesign(design, current) ? randomPillDesign(current, random) : design;
}
