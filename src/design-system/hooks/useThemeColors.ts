import { useColorScheme } from "react-native";

import { darkColors, lightColors, type ThemeColors } from "../tokens";

export function useThemeColors(): ThemeColors {
  return useColorScheme() === "dark" ? darkColors : lightColors;
}
