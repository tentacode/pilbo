export function isLowStockNoticeVisible(
  lowStockMedIds: string[],
  dismissedMedIds: string[],
): boolean {
  return lowStockMedIds.some((medId) => !dismissedMedIds.includes(medId));
}

export function keepLowStockMedIds(dismissedMedIds: string[], lowStockMedIds: string[]): string[] {
  return dismissedMedIds.filter((medId) => lowStockMedIds.includes(medId));
}
