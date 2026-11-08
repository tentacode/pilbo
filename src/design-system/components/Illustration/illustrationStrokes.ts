import { useMemo } from "react";

import { useThemeColors } from "../../hooks/useThemeColors";
import type { ThemeColors } from "../../tokens";

function createIllustrationStrokes(themeColors: ThemeColors) {
  return {
    outline: {
      fill: "none",
      stroke: themeColors.ink,
      strokeWidth: 2.5,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    filled: {
      stroke: themeColors.ink,
      strokeWidth: 2.5,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    outlineOnAccent: {
      fill: "none",
      stroke: themeColors.onAccent,
      strokeWidth: 2.5,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    dashed: {
      fill: "none",
      stroke: themeColors.ink,
      strokeWidth: 2.5,
      strokeLinecap: "round",
      strokeDasharray: "7 8",
    },
    pillOutline: { stroke: themeColors.ink, strokeWidth: 2, strokeLinejoin: "round" },
    pillJunction: { fill: "none", stroke: themeColors.onAccent, strokeWidth: 1.5 },
    pillScoreLine: {
      fill: "none",
      stroke: themeColors.onAccent,
      strokeOpacity: 0.35,
      strokeWidth: 1.6,
      strokeLinecap: "round",
    },
    pillHighlight: {
      fill: "none",
      stroke: themeColors.pillHighlight,
      strokeWidth: 2.2,
      strokeLinecap: "round",
      opacity: 0.9,
    },
  } as const;
}

export function useIllustrationStrokes() {
  const themeColors = useThemeColors();
  return useMemo(() => createIllustrationStrokes(themeColors), [themeColors]);
}
