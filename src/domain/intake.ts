import { compareMeds, type MedQuantity } from "./med";

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

export const REMINDER_INTERVALS_MINUTES = [5, 10, 15, 30] as const;

export const DEFAULT_REMINDER_INTERVAL_MINUTES = 10;

export interface Intake {
  id: string;
  time: { hour: number; minute: number };
  days: Weekday[];
  reminderIntervalMinutes: number;
  medQuantities: MedQuantity[];
}

export function sortIntakeMeds(intake: Intake): Intake {
  return {
    ...intake,
    medQuantities: [...intake.medQuantities].sort((first, second) =>
      compareMeds(first.med, second.med),
    ),
  };
}

export function formatIntakeTime({ hour, minute }: Intake["time"]): string {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function intakeDateOn(day: Date, { hour, minute }: Intake["time"]): Date {
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute);
}
