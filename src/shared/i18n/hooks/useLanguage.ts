import { useTranslation } from "react-i18next";

import type { Language } from "../resources";

export function useLanguage(): Language {
  const { i18n } = useTranslation();
  return i18n.language as Language;
}
