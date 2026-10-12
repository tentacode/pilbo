import { Linking } from "react-native";

const supportEmail = "pilbo@tentacode.dev";
const subject = "Pilbo : problème rencontré";

export function buildSupportMailUrl(details?: string) {
  const body = details ? `\n\n---\nDétail technique : ${details}` : "";
  return `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function contactSupport(details?: string) {
  Linking.openURL(buildSupportMailUrl(details)).catch(() => {});
}
