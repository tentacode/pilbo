import type { TFunction } from "i18next";

export function formatAppVersion(
  t: TFunction<"settings">,
  version: string | null,
  build: string | null,
): string {
  if (version === null) {
    return t("Inconnue");
  }
  return build === null ? version : `${version} (${build})`;
}

export function formatDayCount(t: TFunction<"settings">, days: number): string {
  return t("{{count}} jours", { count: days });
}
