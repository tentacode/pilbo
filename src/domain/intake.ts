import type { MedQuantity } from "./med";

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

export interface Intake {
  id: string;
  time: { hour: number; minute: number };
  days: Weekday[];
  reminderIntervalMinutes: number;
  medQuantities: MedQuantity[];
}
