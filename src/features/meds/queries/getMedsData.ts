import type { Intake } from "@/domain/intake";
import { type IntakeLog, toLocalDate } from "@/domain/intakeLog";
import type { Med } from "@/domain/med";
import type { MedStock } from "@/domain/stock";
import type { Database } from "@/shared/database/types";

import { getAllIntakes } from "@/features/pillbox/queries/getAllIntakes";
import { getAllMeds } from "@/features/pillbox/queries/getAllMeds";
import { getAllStocks } from "@/features/stocks/queries/getAllStocks";
import { getIntakeLogsOfDay } from "@/features/today/queries/getIntakeLogsOfDay";

export type MedsStoredData = {
  localDate: string;
  meds: Med[];
  medStocks: MedStock[];
  intakes: Intake[];
  intakeLogs: IntakeLog[];
};

export function getMedsData(database: Database, date: Date): MedsStoredData {
  const localDate = toLocalDate(date);
  return {
    localDate,
    meds: getAllMeds(database),
    medStocks: getAllStocks(database),
    intakes: getAllIntakes(database),
    intakeLogs: getIntakeLogsOfDay(database, localDate),
  };
}
