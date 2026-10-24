export type IntakeLogStatus = "taken" | "skipped";

export interface IntakeLog {
  id: string;
  intakeId: string;
  expectedIntakeAt: string;
  createdAt: string;
  status: IntakeLogStatus;
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function toLocalDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function toLocalDateTime(date: Date): string {
  return `${toLocalDate(date)}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromLocalDateTime(text: string): Date {
  const [datePart, timePart] = text.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute);
}

export function fromLocalDate(text: string): Date {
  const [year, month, day] = text.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function addDaysToLocalDate(localDate: string, days: number): string {
  return toLocalDate(addDays(fromLocalDate(localDate), days));
}
