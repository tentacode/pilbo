import { toLocalDate } from "@/domain/intakeLog";

import type { Month } from "./calendarTypes";

export function monthOf(localDate: string): Month {
  const [year, month] = localDate.split("-").map(Number);
  return { year, month: month - 1 };
}

export function shiftMonth({ year, month }: Month, months: number): Month {
  const date = new Date(year, month + months, 1);
  return { year: date.getFullYear(), month: date.getMonth() };
}

export function compareMonths(first: Month, second: Month): number {
  return first.year * 12 + first.month - (second.year * 12 + second.month);
}

export function firstDayOf({ year, month }: Month): string {
  return toLocalDate(new Date(year, month, 1));
}

export function daysInMonth({ year, month }: Month): number {
  return new Date(year, month + 1, 0).getDate();
}
