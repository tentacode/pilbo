export const NOTIFICATION_SOUNDS = [
  "beep_short",
  "beep",
  "chime",
  "drop",
  "pill_rattle",
  "gentle_alert_resolved",
  "nocturne",
  "shire",
  "vibration",
] as const;

export type NotificationSound = (typeof NOTIFICATION_SOUNDS)[number];

export const DEFAULT_NOTIFICATION_SOUND: NotificationSound = "beep";

export function soundFileOf(sound: NotificationSound): string {
  return sound === "vibration" ? "silence.wav" : `${sound}.wav`;
}

export function isNotificationSound(value: unknown): value is NotificationSound {
  return NOTIFICATION_SOUNDS.some((sound) => sound === value);
}

export function toNotificationSound(value: unknown): NotificationSound {
  return isNotificationSound(value) ? value : DEFAULT_NOTIFICATION_SOUND;
}
