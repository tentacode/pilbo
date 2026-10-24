import type { Intake } from "@/domain/intake";
import { type IntakeLog, toLocalDate } from "@/domain/intakeLog";
import type { MedStock } from "@/domain/stock";
import type { Database } from "@/shared/database/types";

import { getAllIntakes } from "@/features/pillbox/queries/getAllIntakes";
import { getIntakeLogsOfDay } from "@/features/today/queries/getIntakeLogsOfDay";
import { getAllStocks } from "./getAllStocks";

export type StocksStoredData = {
  localDate: string;
  medStocks: MedStock[];
  intakes: Intake[];
  intakeLogs: IntakeLog[];
};

export function getStocksData(database: Database, date: Date): StocksStoredData {
  const localDate = toLocalDate(date);
  return {
    localDate,
    medStocks: getAllStocks(database),
    intakes: getAllIntakes(database),
    intakeLogs: getIntakeLogsOfDay(database, localDate),
  };
}
