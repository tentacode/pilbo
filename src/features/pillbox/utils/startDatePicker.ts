import { toLocalDate } from "@/domain/intakeLog";

import type { Month } from "@/features/calendar/utils/calendarTypes";
import { compareMonths, daysInMonth, monthOf } from "@/features/calendar/utils/months";

export type StartDateDay = {
  localDate: string;
  dayOfMonth: number;
  isToday: boolean;
  isSelected: boolean;
  isSelectable: boolean;
};

export function startDateDaysOf(month: Month, startsOn: string, today: string): StartDateDay[] {
  return Array.from({ length: daysInMonth(month) }, (_, index) => {
    const localDate = toLocalDate(new Date(month.year, month.month, index + 1));
    return {
      localDate,
      dayOfMonth: index + 1,
      isToday: localDate === today,
      isSelected: localDate === startsOn,
      isSelectable: localDate >= today,
    };
  });
}

export function canShowPreviousStartMonth(month: Month, startsOn: string, today: string): boolean {
  const earliestDate = startsOn < today ? startsOn : today;
  return compareMonths(month, monthOf(earliestDate)) > 0;
}
