import type { Intake } from "@/domain/intake";
import { type IntakeLog, toLocalDate } from "@/domain/intakeLog";
import type { Med } from "@/domain/med";
import type { Stock } from "@/domain/stock";
import type { Database } from "@/shared/database/types";

import { getMedById } from "@/features/pillbox/queries/getMedById";
import { getStockByMedId } from "@/features/stocks/queries/getStockByMedId";
import { getIntakeLogsOfDay } from "@/features/today/queries/getIntakeLogsOfDay";
import { getActiveIntakesOfMed } from "./getActiveIntakesOfMed";
import { getMedTakingSummary, type MedTakingSummary } from "./getMedTakingSummary";

export type MedSheetStoredData = {
  localDate: string;
  med?: Med;
  stock?: Stock;
  intakes: Intake[];
  intakeLogs: IntakeLog[];
  takingSummary: MedTakingSummary;
};

export function getMedSheetData(database: Database, medId: string, date: Date): MedSheetStoredData {
  const localDate = toLocalDate(date);
  return {
    localDate,
    med: getMedById(database, medId),
    stock: getStockByMedId(database, medId)?.stock,
    intakes: getActiveIntakesOfMed(database, medId),
    intakeLogs: getIntakeLogsOfDay(database, localDate),
    takingSummary: getMedTakingSummary(database, medId, localDate),
  };
}
