import { type Intake, isEveryDay } from "@/domain/intake";
import type { IntakeLog } from "@/domain/intakeLog";
import { nextDueDate } from "@/domain/recurrence";

export function nextIntakeDatesOf(
  intakes: Intake[],
  todayIntakeLogs: IntakeLog[],
  now: Date,
): Map<string, Date | null> {
  const handledIntakeIds = new Set(todayIntakeLogs.map(({ intakeId }) => intakeId));
  return new Map(
    intakes
      .filter((intake) => !isEveryDay(intake))
      .map((intake) => [intake.id, nextDueDate(intake, now, handledIntakeIds.has(intake.id))]),
  );
}
