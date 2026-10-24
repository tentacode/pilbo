import { useState } from "react";

import type { Intake } from "@/domain/intake";
import { type IntakeLog, toLocalDate } from "@/domain/intakeLog";
import type { Med } from "@/domain/med";
import type { Stock } from "@/domain/stock";
import { database } from "@/shared/database/database";

import { getAllIntakes } from "@/features/pillbox/queries/getAllIntakes";
import { getMedById } from "@/features/pillbox/queries/getMedById";
import { getStockByMedId } from "@/features/stocks/queries/getStockByMedId";
import { getIntakeLogsOfDay } from "@/features/today/queries/getIntakeLogsOfDay";

type StockEditData = {
  med?: Med;
  stock?: Stock;
  intakes: Intake[];
  intakeLogs: IntakeLog[];
};

function readStockEditData(medId: string): StockEditData {
  return {
    med: getMedById(database, medId),
    stock: getStockByMedId(database, medId)?.stock,
    intakes: getAllIntakes(database),
    intakeLogs: getIntakeLogsOfDay(database, toLocalDate(new Date())),
  };
}

export function useStockEditData(medId: string): StockEditData {
  const [data] = useState(() => readStockEditData(medId));
  return data;
}
