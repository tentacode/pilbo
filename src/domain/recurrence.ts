import { type IntakeRecurrence, weekdayOf } from "./intake";
import { addDays, fromLocalDate, toLocalDate } from "./intakeLog";

const DAYS_PER_WEEK = 7;
const MONTHS_PER_YEAR = 12;
const MILLISECONDS_PER_DAY = 86_400_000;
const SEARCH_LIMIT_DAYS = 400;

function calendarDayNumber(date: Date): number {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MILLISECONDS_PER_DAY;
}

export function mondayOf(date: Date): Date {
  return addDays(date, -((date.getDay() + DAYS_PER_WEEK - 1) % DAYS_PER_WEEK));
}

function weeksBetween(start: Date, date: Date): number {
  return Math.round(
    (calendarDayNumber(mondayOf(date)) - calendarDayNumber(mondayOf(start))) / DAYS_PER_WEEK,
  );
}

function monthsBetween(start: Date, date: Date): number {
  return (
    (date.getFullYear() - start.getFullYear()) * MONTHS_PER_YEAR +
    date.getMonth() -
    start.getMonth()
  );
}

function daysInMonthOf(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function isActiveWeek({ interval, startsOn }: IntakeRecurrence, date: Date): boolean {
  return weeksBetween(fromLocalDate(startsOn), date) % interval === 0;
}

export function monthlyDayOf(startsOn: string, date: Date): number {
  return Math.min(fromLocalDate(startsOn).getDate(), daysInMonthOf(date));
}

export function isIntakeDueOn(recurrence: IntakeRecurrence, date: Date): boolean {
  const { frequency, interval, startsOn, days } = recurrence;
  if (toLocalDate(date) < startsOn) {
    return false;
  }
  switch (frequency) {
    case "daily":
      return days.includes(weekdayOf(date));
    case "weekly":
      return isActiveWeek(recurrence, date) && days.includes(weekdayOf(date));
    case "monthly":
      return (
        monthsBetween(fromLocalDate(startsOn), date) % interval === 0 &&
        date.getDate() === monthlyDayOf(startsOn, date)
      );
  }
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function nextDueDates(recurrence: IntakeRecurrence, from: Date, count: number): Date[] {
  const dueDates: Date[] = [];
  const startsOn = fromLocalDate(recurrence.startsOn);
  let day = startOfDay(from < startsOn ? startsOn : from);
  for (let index = 0; index < SEARCH_LIMIT_DAYS && dueDates.length < count; index++) {
    if (isIntakeDueOn(recurrence, day)) {
      dueDates.push(day);
    }
    day = addDays(day, 1);
  }
  return dueDates;
}

export function nextDueDate(
  recurrence: IntakeRecurrence,
  from: Date,
  isHandledToday: boolean,
): Date | null {
  const searchFrom = isHandledToday ? addDays(startOfDay(from), 1) : from;
  return nextDueDates(recurrence, searchFrom, 1)[0] ?? null;
}
