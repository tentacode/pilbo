const UNKNOWN_VERSION = "Inconnue";

export function formatAppVersion(version: string | null, build: string | null): string {
  if (version === null) {
    return UNKNOWN_VERSION;
  }
  return build === null ? version : `${version} (${build})`;
}

export function formatDayCount(days: number): string {
  return days === 1 ? "1 jour" : `${days} jours`;
}
