import * as Notifications from "expo-notifications";

import { NOTIFICATION_CHANNEL_IDS } from "@/config/notifications";
import { i18n } from "@/shared/i18n/i18n";

// Called again on each language change: Android keeps the importance and sound of an existing
// channel, but updates its name.
export async function setUpNotificationChannels(): Promise<void> {
  await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_IDS.reminders, {
    name: i18n.t("Rappels de prise", { ns: "notifications" }),
    importance: Notifications.AndroidImportance.HIGH,
    sound: "beep.wav",
    enableVibrate: true,
  });
  await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_IDS.lowStock, {
    name: i18n.t("Stock bas", { ns: "notifications" }),
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: "beep.wav",
    enableVibrate: true,
  });
}
