import type { AppLanguage } from "../store/settingsStore";

const SUPPORTED_LANGUAGES: readonly AppLanguage[] = ["fr", "en"];
const FALLBACK_LANGUAGE: AppLanguage = "en";

function isSupportedLanguage(languageCode: string | null): languageCode is AppLanguage {
  return SUPPORTED_LANGUAGES.some((language) => language === languageCode);
}

export function resolveLanguage(
  chosenLanguage: AppLanguage | null,
  systemLanguageCodes: (string | null)[],
): AppLanguage {
  return chosenLanguage ?? systemLanguageCodes.find(isSupportedLanguage) ?? FALLBACK_LANGUAGE;
}
