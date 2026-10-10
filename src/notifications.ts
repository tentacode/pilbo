import * as Notifications from "expo-notifications";

// Without this handler, iOS hides notifications while the app is in the foreground.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function requestPermission(): Promise<boolean> {
  const { granted } = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowSound: true, allowBadge: true },
  });
  return granted;
}

type ReminderOptions = {
  startDate: Date;
  message: string;
  badge: number;
  count?: number;
  minutesBetweenReminders?: number;
};

const MILLISECONDS_PER_MINUTE = 60 * 1000;

export async function cancelScheduledReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function scheduleReminders({
  startDate,
  message,
  badge,
  count = 6,
  minutesBetweenReminders = 10,
}: ReminderOptions): Promise<void> {
  for (let index = 0; index < count; index++) {
    const reminderDate = new Date(
      startDate.getTime() + index * minutesBetweenReminders * MILLISECONDS_PER_MINUTE,
    );

    await Notifications.scheduleNotificationAsync({
      // A date-based identifier replaces an existing reminder at the same time instead of duplicating it.
      identifier: `reminder-${reminderDate.toISOString()}`,
      content: {
        body: message,
        sound: "beep.wav",
        badge,
        interruptionLevel: "active",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reminderDate,
      },
    });
  }
}

export async function clearReminders(): Promise<void> {
  await cancelScheduledReminders();
  await Notifications.dismissAllNotificationsAsync();
  await Notifications.setBadgeCountAsync(0);
}
