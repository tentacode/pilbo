import type { PillSize } from "@/domain/med";

import { colors } from "../../tokens";

export const PILL_VIEWBOX = "0 0 40 40";
export const PILL_CENTER = 20;
export const PILL_ROTATION = -35;

export const pillScales: Record<PillSize, number> = {
  small: 0.72,
  medium: 1,
  large: 1.15,
};

export function pillStrokes(scale: number) {
  return {
    outline: { stroke: colors.ink, strokeWidth: 1.8 / scale, strokeLinejoin: "round" },
    junction: { stroke: colors.ink, strokeWidth: 1.5 / scale, fill: "none" },
    scoreLine: {
      stroke: colors.ink,
      strokeOpacity: 0.35,
      strokeWidth: 1.6 / scale,
      strokeLinecap: "round",
      fill: "none",
    },
    highlight: {
      stroke: colors.pillHighlight,
      strokeWidth: 2.2 / scale,
      strokeLinecap: "round",
      opacity: 0.9,
      fill: "none",
    },
  } as const;
}
