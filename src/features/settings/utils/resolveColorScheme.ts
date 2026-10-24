import type { ColorSchemeName } from "react-native";

import type { AppColorScheme } from "../store/settingsStore";

const FALLBACK_COLOR_SCHEME: AppColorScheme = "light";

export function resolveColorScheme(
  chosenColorScheme: AppColorScheme | null,
  systemColorScheme: ColorSchemeName,
): AppColorScheme {
  if (chosenColorScheme) {
    return chosenColorScheme;
  }
  return systemColorScheme === "dark" || systemColorScheme === "light"
    ? systemColorScheme
    : FALLBACK_COLOR_SCHEME;
}
