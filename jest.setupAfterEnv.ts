import { FALLBACK_LANGUAGE, i18n } from "@/shared/i18n/i18n";

afterEach(() => {
  i18n.changeLanguage(FALLBACK_LANGUAGE);
});
