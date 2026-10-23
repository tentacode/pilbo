import { getLocales } from "expo-localization";

import { type AppLanguage, useSettingsStore } from "../store/settingsStore";
import { resolveLanguage } from "../utils/resolveLanguage";

export function useAppLanguage(): AppLanguage {
  const chosenLanguage = useSettingsStore((state) => state.language);
  return resolveLanguage(
    chosenLanguage,
    getLocales().map((locale) => locale.languageCode),
  );
}
