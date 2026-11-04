import type { Intake } from "@/domain/intake";
import type { IntakeLog } from "@/domain/intakeLog";
import type { MedStock } from "@/domain/stock";

import { computeStockForecast } from "./stockForecast";
import type { StockItem } from "./stockTypes";

export function computeStockItems(
  medStocks: MedStock[],
  intakes: Intake[],
  intakeLogs: IntakeLog[],
  now: Date,
): StockItem[] {
  return medStocks.map(({ med, stock }) => ({
    med,
    stock,
    forecast: computeStockForecast(stock, intakes, intakeLogs, now),
  }));
}
