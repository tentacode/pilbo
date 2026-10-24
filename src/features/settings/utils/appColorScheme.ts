import { Appearance } from "react-native";

import { type AppColorScheme, useSettingsStore } from "../store/settingsStore";

export function applyColorScheme(colorScheme: AppColorScheme | null): void {
  Appearance.setColorScheme(colorScheme ?? "unspecified");
}

export function applyStoredColorScheme(): void {
  applyColorScheme(useSettingsStore.getState().colorScheme);
}
