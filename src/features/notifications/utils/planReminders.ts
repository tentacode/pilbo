import {
  MAXIMUM_SCHEDULED_REMINDERS,
  REMINDER_COUNT,
  reminderChannelId,
} from "@/config/notifications";
import { type Intake, intakeDateOn } from "@/domain/intake";
import { type IntakeLog, toLocalDate, toLocalDateTime } from "@/domain/intakeLog";
import type { NotificationSound } from "@/domain/sound";

import { formatReminderBody, formatReminderTitle } from "./formatters";
import { REMINDER_IDENTIFIER_PREFIX } from "./notificationTab";
import { horizonEndOf, type IntakeDay } from "./planIntakeDays";
import type { ReminderIntake } from "./reminderActions";
import { reminderBadge } from "./reminderBadge";

export type PlannedReminder = {
  identifier: string;
  date: Date;
  title: string;
  body: string;
  badge?: number;
  presentationGroup?: string;
  reminderIntake?: ReminderIntake;
  interruptionLevel: "active" | "timeSensitive";
  sound: NotificationSound;
  channelId: string;
};

type PlanRemindersOptions = {
  intakeDays: IntakeDay[];
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
        badge: reminderBadge(countPendingAt(date)),
        presentationGroup: `${REMINDER_IDENTIFIER_PREFIX}${intake.id}-${toLocalDate(day)}`,
        reminderIntake: { intakeId: intake.id, intakeDay: toLocalDate(day) },
        interruptionLevel: "timeSensitive",
        sound: intake.sound,
        channelId: reminderChannelId(intake.sound),
      };
    }),
  );
}

function isToday({ day }: IntakeDay, now: Date): boolean {
  return toLocalDate(day) === toLocalDate(now);
}

function planTodayReminders(
  { intakes }: IntakeDay,
  todayLogs: IntakeLog[],
  now: Date,
): PlannedReminder[] {
  const loggedIntakeIds = new Set(todayLogs.map(({ intakeId }) => intakeId));
  const pendingIntakes = intakes.filter(({ id }) => !loggedIntakeIds.has(id));
  return planDayReminders(now, pendingIntakes)
    .flat()
    .filter(({ date }) => date > now);
}

function byFirstDate(first: PlannedReminder[], second: PlannedReminder[]): number {
  return first[0].date.getTime() - second[0].date.getTime();
}

export function planReminders({
  intakeDays,
  todayLogs,
  lowStockAlerts = [],
  now,
}: PlanRemindersOptions): PlannedReminder[] {
  const [firstDay] = intakeDays;
  const todayPlanned = firstDay !== undefined && isToday(firstDay, now);
  const reminders = todayPlanned
    ? planTodayReminders(firstDay, todayLogs, now).slice(0, MAXIMUM_SCHEDULED_REMINDERS)
    : [];

  const horizonEnd = horizonEndOf(now);
  const nextBlocks = [
    ...lowStockAlerts.filter(({ date }) => date < horizonEnd).map((alert) => [alert]),
    ...intakeDays
      .slice(todayPlanned ? 1 : 0)
      .flatMap(({ day, intakes }) => planDayReminders(day, intakes)),
  ].sort(byFirstDate);

  for (const block of nextBlocks) {
    if (reminders.length + block.length > MAXIMUM_SCHEDULED_REMINDERS) {
      break;
    }
    reminders.push(...block);
  }
  return reminders;
}
