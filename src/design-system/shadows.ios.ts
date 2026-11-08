import type { ThemeColors } from "./tokens";

export const createShadows = (themeColors: ThemeColors) => ({
  raised: {
    shadowColor: themeColors.shadow,
    shadowOpacity: 0.14,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  floating: {
    shadowColor: themeColors.shadow,
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
});
