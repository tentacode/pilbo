export const REMINDER_COUNT = 6;
export const MAXIMUM_SCHEDULED_REMINDERS = 64;
export const LOW_STOCK_ALERT_HOUR = 9;

// Android channels keep their importance and sound once created: a change needs new identifiers.
export const NOTIFICATION_CHANNEL_IDS = {
  reminders: "intake-reminders",
  lowStock: "low-stock",
} as const;

export type NotificationChannelId =
  (typeof NOTIFICATION_CHANNEL_IDS)[keyof typeof NOTIFICATION_CHANNEL_IDS];
