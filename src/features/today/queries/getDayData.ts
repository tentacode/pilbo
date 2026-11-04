import { sortIntakeMeds, type Intake } from "@/domain/intake";
import { type IntakeLog, toLocalDate } from "@/domain/intakeLog";
import type { Database } from "@/shared/database/types";

import type { MedLogOfDay } from "@/features/today/utils/todayTypes";
import { getIntakeLogsOfDay } from "./getIntakeLogsOfDay";
import { getIntakesOfDay } from "./getIntakesOfDay";
import { getMedLogsOfDay } from "./getMedLogsOfDay";

export type DayStoredData = {
  localDate: string;
  intakes: Intake[];
  intakeLogs: IntakeLog[];
  medLogs: MedLogOfDay[];
};

export function getDayData(database: Database, date: Date): DayStoredData {
  const localDate = toLocalDate(date);
  return {
    localDate,
    intakes: getIntakesOfDay(database, date).map(sortIntakeMeds),
    intakeLogs: getIntakeLogsOfDay(database, localDate),
    medLogs: getMedLogsOfDay(database, localDate),
  };
}
