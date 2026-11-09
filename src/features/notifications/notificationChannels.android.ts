import * as Notifications from "expo-notifications";

import {
  NOTIFICATION_CHANNEL_IDS,
  type NotificationChannelKind,
  type NotificationChannelSounds,
  notificationChannelId,
} from "@/config/notifications";
import { type NotificationSound, soundFileOf } from "@/domain/sound";
import { i18n } from "@/shared/i18n/i18n";

import { formatSoundName } from "./utils/formatters";

const CHANNEL_IMPORTANCES: Record<NotificationChannelKind, Notifications.AndroidImportance> = {
  reminders: Notifications.AndroidImportance.HIGH,
  lowStock: Notifications.AndroidImportance.DEFAULT,
};

function formatChannelName(kind: NotificationChannelKind, sound: NotificationSound): string {
  const soundName = formatSoundName(i18n.getFixedT(null, "notifications"), sound);
  return kind === "reminders"
    ? i18n.t("Rappels de prise – {{sound}}", { ns: "notifications", sound: soundName })
    : i18n.t("Stock bas – {{sound}}", { ns: "notifications", sound: soundName });
}

function isPilboChannel(channelId: string): boolean {
  return Object.values(NOTIFICATION_CHANNEL_IDS).some(
    (baseId) => channelId === baseId || channelId.startsWith(`${baseId}-`),
  );
}

// Called again on each reschedule and language change: Android keeps the importance and sound of an
// existing channel, but updates its name. The unused channels are deleted after the new ones exist,
// so that a channel is always there for the Android 13+ permission request.
export async function setUpNotificationChannels(
  usedSounds: NotificationChannelSounds,
): Promise<void> {
  const usedChannelIds = new Set<string>();
  for (const kind of Object.keys(usedSounds) as NotificationChannelKind[]) {
    for (const sound of new Set(usedSounds[kind])) {
      const channelId = notificationChannelId(kind, sound);
      usedChannelIds.add(channelId);
      await Notifications.setNotificationChannelAsync(channelId, {
        name: formatChannelName(kind, sound),
        importance: CHANNEL_IMPORTANCES[kind],
        sound: sound === "vibration" ? null : soundFileOf(sound),
        enableVibrate: true,
      });
    }
  }

  const channels = await Notifications.getNotificationChannelsAsync();
  for (const { id } of channels) {
    if (isPilboChannel(id) && !usedChannelIds.has(id)) {
      await Notifications.deleteNotificationChannelAsync(id);
    }
  }
}
