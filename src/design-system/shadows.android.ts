import type { ThemeColors } from "./tokens";

function withOpacity(hexColor: string, opacity: number): string {
  return `${hexColor}${Math.round(opacity * 255)
    .toString(16)
    .padStart(2, "0")}`;
}

// Android ignores the iOS shadow props: same shadows with boxShadow, whose blur is twice the iOS radius.
export const createShadows = (themeColors: ThemeColors) => ({
  raised: {
    boxShadow: [
      { offsetX: 0, offsetY: 1, blurRadius: 4, color: withOpacity(themeColors.shadow, 0.14) },
    ],
  },
  floating: {
    boxShadow: [
      { offsetX: 0, offsetY: 4, blurRadius: 32, color: withOpacity(themeColors.shadow, 0.07) },
    ],
  },
});
