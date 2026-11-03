import { StyleSheet, useColorScheme } from "react-native";

import { darkColors, lightColors, type ThemeColors } from "../tokens";

export function createThemedStyles<Styles extends StyleSheet.NamedStyles<Styles>>(
  createStyles: (themeColors: ThemeColors) => Styles,
): () => Styles {
  const lightStyles = StyleSheet.create(createStyles(lightColors));
  const darkStyles = StyleSheet.create(createStyles(darkColors));
  return function useThemedStyles() {
    return useColorScheme() === "dark" ? darkStyles : lightStyles;
  };
}
