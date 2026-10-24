import type { Intake } from "@/domain/intake";
import type { IntakeLog } from "@/domain/intakeLog";
import { compareMeds } from "@/domain/med";
import type { MedStock } from "@/domain/stock";

import { computeStockForecast } from "./stockForecast";
import type { StockItem, StockSections } from "./stockTypes";

function sortingDaysOf({ forecast }: StockItem): number {
  return forecast.daysLeft ?? (forecast.status === "low" ? 0 : Number.POSITIVE_INFINITY);
}

function compareStockItems(first: StockItem, second: StockItem): number {
  return sortingDaysOf(first) - sortingDaysOf(second) || compareMeds(first.med, second.med);
}

export function computeStockItems(
  medStocks: MedStock[],
  intakes: Intake[],
  intakeLogs: IntakeLog[],
  now: Date,
): StockItem[] {
  return medStocks
    .map(({ med, stock }) => ({
      med,
      stock,
      forecast: computeStockForecast(stock, intakes, intakeLogs, now),
    }))
    .sort(compareStockItems);
}

export function splitStockSections(stockItems: StockItem[]): StockSections {
  return {
    low: stockItems.filter(({ forecast }) => forecast.status === "low"),
    sufficient: stockItems.filter(({ forecast }) => forecast.status !== "low"),
  };
}
