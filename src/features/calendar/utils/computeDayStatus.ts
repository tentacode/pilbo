import type { IntakeLog } from "@/domain/intakeLog";

import {
  LATE_THRESHOLD_MINUTES,
  minutesFromNow,
  toValidation,
} from "@/features/today/utils/computeTodayIntakes";
import type { DayStatus, IntakeVersion } from "./calendarTypes";

export function computeDayStatus(
  plannedIntakes: Pick<IntakeVersion, "id" | "time">[],
  intakeLogs: IntakeLog[],
  now?: Date,
): DayStatus {
  const logsByIntakeId = new Map(intakeLogs.map((intakeLog) => [intakeLog.intakeId, intakeLog]));
  const consideredIntakes =
    now === undefined
      ? plannedIntakes
      : plannedIntakes.filter(
          ({ id, time }) =>
            logsByIntakeId.has(id) || minutesFromNow(time, now) < -LATE_THRESHOLD_MINUTES,
        );
  if (consideredIntakes.length === 0) {
    return "none";
  }
  const logs = consideredIntakes.flatMap(({ id }) => logsByIntakeId.get(id) ?? []);
  const isAnyIntakeMissed =
    logs.length < consideredIntakes.length || logs.some(({ status }) => status === "missed");
  if (isAnyIntakeMissed) {
    return "missed";
  }
  if (logs.some((intakeLog) => toValidation(intakeLog).isTakenLate)) {
    return "late";
  }
  return logs.some(({ status }) => status === "taken") ? "taken" : "skipped";
}
