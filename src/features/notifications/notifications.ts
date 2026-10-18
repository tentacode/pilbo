import * as Notifications from "expo-notifications";

import type { PlannedReminder } from "./utils/planReminders";

// Without this handler, iOS hides notifications while the app is in the foreground.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export type PermissionStatus = "granted" | "denied" | "undetermined";

export async function requestPermission(): Promise<boolean> {
  const { granted } = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowSound: true, allowBadge: true },
  });
  return granted;
}

export async function getPermissionGranted(): Promise<boolean> {
  const { granted } = await Notifications.getPermissionsAsync();
  return granted;
}

export async function getPermissionStatus(): Promise<PermissionStatus> {
  const { granted, canAskAgain } = await Notifications.getPermissionsAsync();
  if (granted) {
    return "granted";
  }
  return canAskAgain ? "undetermined" : "denied";
}

export async function resetReminders(plannedReminders: PlannedReminder[]): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.dismissAllNotificationsAsync();
  await Notifications.setBadgeCountAsync(0);

  for (const { identifier, date, title, body, badge } of plannedReminders) {
    await Notifications.scheduleNotificationAsync({
      identifier,
      content: { title, body, badge, sound: "beep.wav", interruptionLevel: "active" },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date },
    });
  }
}
