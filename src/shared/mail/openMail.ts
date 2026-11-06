import { Linking } from "react-native";

const supportEmail = "pilbo@tentacode.dev";

export function buildMailUrl(subject: string, body = "") {
  return `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function openMail(subject: string, body?: string) {
  Linking.openURL(buildMailUrl(subject, body)).catch(() => {});
}
