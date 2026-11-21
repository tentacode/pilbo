import { lowStockChannelId, REOPEN_APP_WARNING_DELAY_MINUTES } from "@/config/notifications";
import type { NotificationSound } from "@/domain/sound";

import { formatReopenAppWarningBody, formatReopenAppWarningTitle } from "./formatters";
import { REOPEN_APP_WARNING_IDENTIFIER } from "./notificationTab";
import type { PlannedReminder } from "./planReminders";

const MILLISECONDS_PER_MINUTE = 60_000;

export function planReopenAppWarning(
  plannedReminders: PlannedReminder[],
  sound: NotificationSound,
): PlannedReminder[] {
  const intakeReminderTimes = plannedReminders
    .filter(({ reminderIntake }) => reminderIntake !== undefined)
    .map(({ date }) => date.getTime());
  if (intakeReminderTimes.length === 0) {
    return [];
  }
  const lastReminderTime = Math.max(...intakeReminderTimes);

  return [
    {
      identifier: REOPEN_APP_WARNING_IDENTIFIER,
      date: new Date(lastReminderTime + REOPEN_APP_WARNING_DELAY_MINUTES * MILLISECONDS_PER_MINUTE),
      title: formatReopenAppWarningTitle(),
      body: formatReopenAppWarningBody(),
      interruptionLevel: "active",
      sound,
      channelId: lowStockChannelId(sound),
    },
  ];
}
