import type { Intake } from "@/domain/intake";
import { addDays } from "@/domain/intakeLog";
import { isIntakeDueOn } from "@/domain/recurrence";

export type IntakeDay = { day: Date; intakes: Intake[] };

const HORIZON_YEARS = 1;

export function horizonEndOf(now: Date): Date {
  return addDays(new Date(now.getFullYear() + HORIZON_YEARS, now.getMonth(), now.getDate()), 1);
}

export function planIntakeDays(intakes: Intake[], now: Date): IntakeDay[] {
  const intakeDays: IntakeDay[] = [];
  const horizonEnd = horizonEndOf(now);
  for (
    let day = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    day < horizonEnd;
    day = addDays(day, 1)
  ) {
    const dueIntakes = intakes.filter((intake) => isIntakeDueOn(intake, day));
    if (dueIntakes.length > 0) {
      intakeDays.push({ day, intakes: dueIntakes });
    }
  }
  return intakeDays;
}
