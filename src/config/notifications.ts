import { DEFAULT_NOTIFICATION_SOUND, type NotificationSound } from "@/domain/sound";

export const REMINDER_COUNT = 6;
export const MAXIMUM_SCHEDULED_REMINDERS = 64;
export const LOW_STOCK_ALERT_HOUR = 9;

// Android channels keep their importance and sound once created: each sound has its own channel, and
// a change of importance needs new identifiers. The default sound keeps the original identifiers.
export const NOTIFICATION_CHANNEL_IDS = {
  reminders: "intake-reminders",
  lowStock: "low-stock",
} as const;

export type NotificationChannelKind = keyof typeof NOTIFICATION_CHANNEL_IDS;

export type NotificationChannelSounds = Record<NotificationChannelKind, NotificationSound[]>;

export function notificationChannelId(
  kind: NotificationChannelKind,
  sound: NotificationSound,
): string {
  const baseId = NOTIFICATION_CHANNEL_IDS[kind];
  return sound === DEFAULT_NOTIFICATION_SOUND ? baseId : `${baseId}-${sound}`;
}

export function reminderChannelId(sound: NotificationSound): string {
  return notificationChannelId("reminders", sound);
}

export function lowStockChannelId(sound: NotificationSound): string {
  return notificationChannelId("lowStock", sound);
}
