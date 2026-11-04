import type { Intake } from "@/domain/intake";
import { fromLocalDateTime, toLocalDateTime } from "@/domain/intakeLog";

export function takenTimeOf(takenAt: string): Intake["time"] {
  const date = fromLocalDateTime(takenAt);
  return { hour: date.getHours(), minute: date.getMinutes() };
}

export function withTakenTime(takenAt: string, { hour, minute }: Intake["time"]): string {
  const date = fromLocalDateTime(takenAt);
  date.setHours(hour, minute);
  return toLocalDateTime(date);
}

export function isSameTime(first: Intake["time"], second: Intake["time"]): boolean {
  return first.hour === second.hour && first.minute === second.minute;
}
