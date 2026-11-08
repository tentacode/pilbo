import type { PillSize } from "@/domain/med";

import type { ThemeColors } from "../../tokens";

export const PILL_VIEWBOX = "0 0 40 40";
export const PILL_CENTER = 20;
export const PILL_ROTATION = -35;

export const pillScales: Record<PillSize, number> = {
  small: 0.72,
  medium: 1,
  large: 1.15,
};

const LARGE_DISPLAY_SIZE = 96;
const MEDIUM_DISPLAY_SIZE = 64;

export function outlineRatioFor(displaySize: number): number {
  if (displaySize >= LARGE_DISPLAY_SIZE) {
    return 1.15 / 1.8;
  }
  return displaySize >= MEDIUM_DISPLAY_SIZE ? 1.4 / 1.8 : 1;
}

export function pillStrokes(themeColors: ThemeColors, scale: number, outlineRatio = 1) {
  return {
    outline: {
      stroke: themeColors.ink,
      strokeWidth: (1.8 * outlineRatio) / scale,
      strokeLinejoin: "round",
    },
    junction: {
      stroke: themeColors.onAccent,
      strokeWidth: (1.5 * outlineRatio) / scale,
      fill: "none",
    },
    scoreLine: {
      stroke: themeColors.onAccent,
      strokeOpacity: 0.35,
      strokeWidth: 1.6 / scale,
      strokeLinecap: "round",
      fill: "none",
    },
    highlight: {
      stroke: themeColors.pillHighlight,
      strokeWidth: 2.2 / scale,
      strokeLinecap: "round",
      opacity: 0.9,
      fill: "none",
    },
  } as const;
}
