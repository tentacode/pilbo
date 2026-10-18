import { colors } from "../../tokens";

export const illustrationStrokes = {
  outline: {
    fill: "none",
    stroke: colors.ink,
    strokeWidth: 2.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  },
  filled: {
    stroke: colors.ink,
    strokeWidth: 2.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  },
  dashed: {
    fill: "none",
    stroke: colors.ink,
    strokeWidth: 2.5,
    strokeLinecap: "round",
    strokeDasharray: "7 8",
  },
  pillOutline: { stroke: colors.ink, strokeWidth: 2, strokeLinejoin: "round" },
  pillJunction: { fill: "none", stroke: colors.ink, strokeWidth: 1.5 },
  pillScoreLine: {
    fill: "none",
    stroke: colors.ink,
    strokeOpacity: 0.35,
    strokeWidth: 1.6,
    strokeLinecap: "round",
  },
  pillHighlight: {
    fill: "none",
    stroke: colors.pillHighlight,
    strokeWidth: 2.2,
    strokeLinecap: "round",
    opacity: 0.9,
  },
} as const;
