import { type MedQuantity, sortMedQuantities } from "./med";
import type { NotificationSound } from "./sound";

export type Weekday =
  "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export const WEEKDAYS: readonly Weekday[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const WEEKDAYS_FROM_SUNDAY: readonly Weekday[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export function weekdayOf(date: Date): Weekday {
  return WEEKDAYS_FROM_SUNDAY[date.getDay()];
}

export type IntakeFrequency = "daily" | "weekly" | "monthly";

export const INTAKE_FREQUENCIES: readonly IntakeFrequency[] = ["daily", "weekly", "monthly"];

export const WEEKLY_INTERVALS = [2, 3, 4] as const;

export const MONTHLY_INTERVALS = [1, 2, 3, 6] as const;

export const DEFAULT_WEEKLY_INTERVAL = 2;

export const DEFAULT_MONTHLY_INTERVAL = 1;

export const REMINDER_INTERVALS_MINUTES = [5, 10, 15, 30] as const;

export const DEFAULT_REMINDER_INTERVAL_MINUTES = 10;

export interface Intake {
  id: string;
  time: { hour: number; minute: number };
  days: Weekday[];
  frequency: IntakeFrequency;
  interval: number;
  startsOn: string;
  reminderIntervalMinutes: number;
  sound: NotificationSound;
  medQuantities: MedQuantity[];
}

export type IntakeRecurrence = Pick<Intake, "days" | "frequency" | "interval" | "startsOn">;

export function isEveryDay({ frequency, days }: IntakeRecurrence): boolean {
  return frequency === "daily" && WEEKDAYS.every((weekday) => days.includes(weekday));
}

export function sortIntakeMeds(intake: Intake): Intake {
  return {
    ...intake,
    medQuantities: sortMedQuantities(intake.medQuantities),
  };
}

export function intakeDateOn(day: Date, { hour, minute }: Intake["time"]): Date {
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute);
}
