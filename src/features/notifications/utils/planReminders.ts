import {
  MAXIMUM_SCHEDULED_REMINDERS,
  REMINDER_COUNT,
  reminderChannelId,
} from "@/config/notifications";
import { type Intake, intakeDateOn } from "@/domain/intake";
import { type IntakeLog, toLocalDateTime } from "@/domain/intakeLog";
import type { NotificationSound } from "@/domain/sound";

import { formatReminderBody, formatReminderTitle } from "./formatters";
import { REMINDER_IDENTIFIER_PREFIX } from "./notificationTab";

export type PlannedReminder = {
  identifier: string;
  date: Date;
  title: string;
  body: string;
  badge?: number;
  interruptionLevel: "active" | "timeSensitive";
  sound: NotificationSound;
  channelId: string;
};

type PlanRemindersOptions = {
  todayIntakes: Intake[];
  tomorrowIntakes: Intake[];
  todayLogs: IntakeLog[];
  lowStockAlerts?: PlannedReminder[];
  now: Date;
};

const MILLISECONDS_PER_MINUTE = 60_000;

function planDayReminders(day: Date, pendingIntakes: Intake[]): PlannedReminder[][] {
  const intakeDates = pendingIntakes.map((intake) => intakeDateOn(day, intake.time));
  const countPendingAt = (date: Date) =>
    intakeDates.filter((intakeDate) => intakeDate <= date).length;

  return pendingIntakes.map((intake, intakeIndex) =>
    Array.from({ length: REMINDER_COUNT }, (_, reminderIndex) => {
      const date = new Date(
        intakeDates[intakeIndex].getTime() +
          reminderIndex * intake.reminderIntervalMinutes * MILLISECONDS_PER_MINUTE,
      );
      return {
        identifier: `${REMINDER_IDENTIFIER_PREFIX}${intake.id}-${toLocalDateTime(date)}`,
        date,
        title: formatReminderTitle(intake),
        body: formatReminderBody(intake),
        badge: countPendingAt(date),
        interruptionLevel: "timeSensitive",
        sound: intake.sound,
        channelId: reminderChannelId(intake.sound),
      };
    }),
  );
}

export function planReminders({
  todayIntakes,
  tomorrowIntakes,
  todayLogs,
  lowStockAlerts = [],
  now,
}: PlanRemindersOptions): PlannedReminder[] {
  const loggedIntakeIds = new Set(todayLogs.map(({ intakeId }) => intakeId));
  const pendingTodayIntakes = todayIntakes.filter(({ id }) => !loggedIntakeIds.has(id));
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const reminders = planDayReminders(now, pendingTodayIntakes)
    .flat()
    .filter(({ date }) => date > now)
    .slice(0, MAXIMUM_SCHEDULED_REMINDERS);
  reminders.push(...lowStockAlerts.slice(0, MAXIMUM_SCHEDULED_REMINDERS - reminders.length));

  for (const intakeReminders of planDayReminders(tomorrow, tomorrowIntakes)) {
    if (reminders.length + intakeReminders.length > MAXIMUM_SCHEDULED_REMINDERS) {
      break;
    }
    reminders.push(...intakeReminders);
  }
  return reminders;
}
