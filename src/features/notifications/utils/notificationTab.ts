import type { ResettableTab } from "@/shared/navigation/tabResetStore";

export const REMINDER_IDENTIFIER_PREFIX = "reminder-";
export const LOW_STOCK_IDENTIFIER_PREFIX = "low-stock-";
export const REOPEN_APP_WARNING_IDENTIFIER = "reopen-app-warning";

export function notificationTab(identifier: string): ResettableTab {
  return identifier.startsWith(LOW_STOCK_IDENTIFIER_PREFIX) ? "meds" : "today";
}
