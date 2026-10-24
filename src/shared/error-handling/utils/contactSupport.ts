import type { TFunction } from "i18next";
import { Linking } from "react-native";

const supportEmail = "pilbo@tentacode.dev";

export function buildSupportMailUrl(t: TFunction<"common">, details?: string) {
  const subject = t("Pilbo : problème rencontré");
  const body = details ? `\n\n---\n${t("Détail technique : {{details}}", { details })}` : "";
  return `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function contactSupport(t: TFunction<"common">, details?: string) {
  Linking.openURL(buildSupportMailUrl(t, details)).catch(() => {});
}
