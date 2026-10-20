import { PILL_SHAPES, type PillDesign, type PillShape } from "@/domain/med";

export function withShape(design: PillDesign, shape: PillShape): PillDesign {
  return { ...design, shape };
}

export function pillShapes(): PillShape[] {
  return Object.keys(PILL_SHAPES) as PillShape[];
}

export function withColor(
  colors: PillDesign["colors"],
  half: 0 | 1,
  color: string,
): PillDesign["colors"] {
  return half === 0 ? [color, colors[1]] : [colors[0], color];
}
