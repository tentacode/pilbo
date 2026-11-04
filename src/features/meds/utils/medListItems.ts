import type { Intake } from "@/domain/intake";
import type { IntakeLog } from "@/domain/intakeLog";
import type { Med } from "@/domain/med";
import type { MedStock } from "@/domain/stock";

import { sortMeds } from "@/features/pillbox/utils/sorters";
import { computeStockForecast } from "@/features/stocks/utils/stockForecast";
import type { MedListItem } from "./medsTypes";

export function computeMedListItems(
  meds: Med[],
  medStocks: MedStock[],
  intakes: Intake[],
  intakeLogs: IntakeLog[],
  now: Date,
): MedListItem[] {
  const stocks = new Map(medStocks.map(({ stock }) => [stock.medId, stock]));
  return sortMeds(meds).map((med) => {
    const stock = stocks.get(med.id);
    return {
      med,
      stockStatus:
        stock === undefined
          ? undefined
          : { stock, forecast: computeStockForecast(stock, intakes, intakeLogs, now) },
    };
  });
}
