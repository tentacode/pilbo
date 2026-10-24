import { getLocales } from "expo-localization";

import { type AppLanguage, useSettingsStore } from "../store/settingsStore";
import { resolveLanguage } from "./resolveLanguage";

export function getSystemLanguageCodes(): (string | null)[] {
  return getLocales().map((locale) => locale.languageCode);
}

export function getAppLanguage(): AppLanguage {
  return resolveLanguage(useSettingsStore.getState().language, getSystemLanguageCodes());
}
