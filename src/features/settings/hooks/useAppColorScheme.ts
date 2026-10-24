import { useColorScheme } from "react-native";

import { type AppColorScheme, useSettingsStore } from "../store/settingsStore";
import { resolveColorScheme } from "../utils/resolveColorScheme";

export function useAppColorScheme(): AppColorScheme {
  const chosenColorScheme = useSettingsStore((state) => state.colorScheme);
  const systemColorScheme = useColorScheme();
  return resolveColorScheme(chosenColorScheme, systemColorScheme);
}
