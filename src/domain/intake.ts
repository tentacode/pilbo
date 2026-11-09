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

export const REMINDER_INTERVALS_MINUTES = [5, 10, 15, 30] as const;

export const DEFAULT_REMINDER_INTERVAL_MINUTES = 10;

export interface Intake {
  id: string;
  time: { hour: number; minute: number };
  days: Weekday[];
  reminderIntervalMinutes: number;
  sound: NotificationSound;
  medQuantities: MedQuantity[];
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
