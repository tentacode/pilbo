import { type AppLanguage, useSettingsStore } from "../store/settingsStore";
import { getSystemLanguageCodes } from "../utils/appLanguage";
import { resolveLanguage } from "../utils/resolveLanguage";

export function useAppLanguage(): AppLanguage {
  const chosenLanguage = useSettingsStore((state) => state.language);
  return resolveLanguage(chosenLanguage, getSystemLanguageCodes());
}
