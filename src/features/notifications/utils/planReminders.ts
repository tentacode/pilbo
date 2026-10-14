import {
  MAXIMUM_SCHEDULED_REMINDERS,
  MINIMUM_DELAY_BEFORE_REMINDER_SECONDS,
  REMINDER_COUNT,
} from "@/config/notifications";
import { type Intake, intakeDateOn } from "@/domain/intake";
import { type IntakeLog, toLocalDateTime } from "@/domain/intakeLog";

import { formatReminderBody, formatReminderTitle } from "./formatters";

export type PlannedReminder = {
  identifier: string;
  date: Date;
  title: string;
  body: string;
  badge: number;
};

type PlanRemindersOptions = {
  todayIntakes: Intake[];
  tomorrowIntakes: Intake[];
  todayLogs: IntakeLog[];
  now: Date;
};

const MILLISECONDS_PER_MINUTE = 60_000;
const MILLISECONDS_PER_SECOND = 1_000;

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
        identifier: `reminder-${intake.id}-${toLocalDateTime(date)}`,
        date,
        title: formatReminderTitle(intake),
        body: formatReminderBody(intake),
        badge: countPendingAt(date),
      };
    }),
  );
}

export function planReminders({
  todayIntakes,
  tomorrowIntakes,
  todayLogs,
  now,
}: PlanRemindersOptions): PlannedReminder[] {
  const loggedIntakeIds = new Set(todayLogs.map(({ intakeId }) => intakeId));
  const pendingTodayIntakes = todayIntakes.filter(({ id }) => !loggedIntakeIds.has(id));
  const earliestDate = new Date(
    now.getTime() + MINIMUM_DELAY_BEFORE_REMINDER_SECONDS * MILLISECONDS_PER_SECOND,
  );
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const reminders = planDayReminders(now, pendingTodayIntakes)
    .flat()
    .filter(({ date }) => date > earliestDate)
    .slice(0, MAXIMUM_SCHEDULED_REMINDERS);

  for (const intakeReminders of planDayReminders(tomorrow, tomorrowIntakes)) {
    if (reminders.length + intakeReminders.length > MAXIMUM_SCHEDULED_REMINDERS) {
      break;
    }
    reminders.push(...intakeReminders);
  }
  return reminders;
}
