import { sortIntakeMeds, type Intake } from "@/domain/intake";
import { type IntakeLog, toLocalDate } from "@/domain/intakeLog";
import type { Database } from "@/shared/database/types";

import { weekdayOf } from "@/features/today/utils/computeTodayIntakes";
import { getIntakeLogsOfDay } from "./getIntakeLogsOfDay";
import { getTodayIntakes } from "./getTodayIntakes";

export type TodayStoredData = {
  localDate: string;
  intakes: Intake[];
  intakeLogs: IntakeLog[];
};

export function getTodayData(database: Database, date: Date): TodayStoredData {
  return {
    localDate: toLocalDate(date),
    intakes: getTodayIntakes(database, weekdayOf(date)).map(sortIntakeMeds),
    intakeLogs: getIntakeLogsOfDay(database, toLocalDate(date)),
  };
}
