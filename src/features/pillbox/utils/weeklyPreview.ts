import type { IntakeRecurrence } from "@/domain/intake";
import { addDays, fromLocalDate, toLocalDate } from "@/domain/intakeLog";
import { isActiveWeek, isIntakeDueOn, mondayOf } from "@/domain/recurrence";

const DAYS_PER_WEEK = 7;
export const PREVIEW_WEEK_COUNT = 4;

export type PreviewDay = {
  date: Date;
  isDue: boolean;
};

export type PreviewWeek = {
  monday: Date;
  isActive: boolean;
  days: PreviewDay[];
};

export function weeklyPreviewOf(recurrence: IntakeRecurrence, today: Date): PreviewWeek[] {
  const localToday = toLocalDate(today);
  const firstDay = recurrence.startsOn > localToday ? recurrence.startsOn : localToday;
  const firstMonday = mondayOf(fromLocalDate(firstDay));
  return Array.from({ length: PREVIEW_WEEK_COUNT }, (_, week) => {
    const monday = addDays(firstMonday, week * DAYS_PER_WEEK);
    return {
      monday,
      isActive: isActiveWeek(recurrence, monday),
      days: Array.from({ length: DAYS_PER_WEEK }, (_, day) => {
        const date = addDays(monday, day);
        return { date, isDue: isIntakeDueOn(recurrence, date) };
      }),
    };
  });
}
