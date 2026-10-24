import { useEffect } from "react";

import { setI18nLanguage } from "@/shared/i18n/i18n";

import { useAppLanguage } from "./useAppLanguage";

export function useI18nLanguageSync(): void {
  const language = useAppLanguage();

  useEffect(() => {
    setI18nLanguage(language);
  }, [language]);
}
