import { fromLocalDate, toLocalDate } from "@/domain/intakeLog";

import type { MonthHistory } from "@/features/calendar/queries/getMonthHistory";
import { weekdayOf } from "@/features/today/utils/computeTodayIntakes";
import type { CalendarDay, IntakeVersion, Month } from "./calendarTypes";
import { computeDayStatus } from "./computeDayStatus";
import { daysInMonth } from "./months";

const DAYS_PER_WEEK = 7;
const LOCAL_DATE_LENGTH = "2026-10-14".length;

function isPlannedOn(version: IntakeVersion, localDate: string, date: Date): boolean {
  return (
    version.createdOn <= localDate &&
    (version.archivedOn === null || version.archivedOn > localDate) &&
    version.days.includes(weekdayOf(date))
  );
}

export function computeMonthDays(
  { intakeVersions, intakeLogs }: MonthHistory,
  month: Month,
  now: Date,
  firstHistoryDate: string | null,
): CalendarDay[] {
  const today = toLocalDate(now);
  return Array.from({ length: daysInMonth(month) }, (_, index) => {
    const date = new Date(month.year, month.month, index + 1);
    const localDate = toLocalDate(date);
    const isToday = localDate === today;
    const isSelectable =
      localDate <= today && firstHistoryDate !== null && localDate >= firstHistoryDate;
    const status = isSelectable
      ? computeDayStatus(
          intakeVersions.filter((version) => isPlannedOn(version, localDate, date)),
          intakeLogs.filter(
            ({ expectedIntakeAt }) => expectedIntakeAt.slice(0, LOCAL_DATE_LENGTH) === localDate,
          ),
          isToday ? now : undefined,
        )
      : "none";
    return { localDate, dayOfMonth: index + 1, status, isToday, isSelectable };
  });
}

export function toCalendarWeeks(days: CalendarDay[]): (CalendarDay | null)[][] {
  if (days.length === 0) {
    return [];
  }
  const leadingBlanks =
    (fromLocalDate(days[0].localDate).getDay() + DAYS_PER_WEEK - 1) % DAYS_PER_WEEK;
  const cells: (CalendarDay | null)[] = [...Array<null>(leadingBlanks).fill(null), ...days];
  while (cells.length % DAYS_PER_WEEK !== 0) {
    cells.push(null);
  }
  return Array.from({ length: cells.length / DAYS_PER_WEEK }, (_, week) =>
    cells.slice(week * DAYS_PER_WEEK, (week + 1) * DAYS_PER_WEEK),
  );
}
