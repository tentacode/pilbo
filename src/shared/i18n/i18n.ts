import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import { DEFAULT_NAMESPACE, type Language, resources } from "./resources";

export const FALLBACK_LANGUAGE: Language = "fr";

export const i18n = createInstance();

i18n.use(initReactI18next).init({
  resources,
  lng: FALLBACK_LANGUAGE,
  fallbackLng: FALLBACK_LANGUAGE,
  defaultNS: DEFAULT_NAMESPACE,
  ns: Object.keys(resources.fr),
  keySeparator: false,
  nsSeparator: false,
  returnEmptyString: false,
  initAsync: false,
  interpolation: { escapeValue: false },
});

export function setI18nLanguage(language: Language): void {
  if (i18n.language !== language) {
    i18n.changeLanguage(language);
  }
}
