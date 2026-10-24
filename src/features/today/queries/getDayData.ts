import { sortIntakeMeds, type Intake } from "@/domain/intake";
import { type IntakeLog, toLocalDate } from "@/domain/intakeLog";
import type { Database } from "@/shared/database/types";

import { getAsNeededMeds } from "@/features/pillbox/queries/getAsNeededMeds";
import { sortMeds } from "@/features/pillbox/utils/sorters";
import type { AsNeededMedOfDay } from "@/features/today/utils/todayTypes";
import { getIntakeLogsOfDay } from "./getIntakeLogsOfDay";
import { getLastMedLogsOfDay } from "./getLastMedLogsOfDay";
import { getIntakesOfDay } from "./getIntakesOfDay";

export type DayStoredData = {
  localDate: string;
  intakes: Intake[];
  intakeLogs: IntakeLog[];
  asNeededMeds: AsNeededMedOfDay[];
};

export function getDayData(database: Database, date: Date): DayStoredData {
  const localDate = toLocalDate(date);
  const lastMedLogs = getLastMedLogsOfDay(database, localDate);
  return {
    localDate,
    intakes: getIntakesOfDay(database, date).map(sortIntakeMeds),
    intakeLogs: getIntakeLogsOfDay(database, localDate),
    asNeededMeds: sortMeds(getAsNeededMeds(database)).map((med) => ({
      med,
      lastTakenAt: lastMedLogs.get(med.id),
    })),
  };
}
