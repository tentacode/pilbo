import { useCallback, useSyncExternalStore } from "react";

import { database, subscribeToDatabaseChanges } from "@/shared/database/database";

import { getStocksData } from "@/features/stocks/queries/getStocksData";
import { computeStockItems } from "@/features/stocks/utils/stockSections";
import { useCurrentMinute } from "@/features/today/hooks/useCurrentMinute";

export function useLowStockCount(): number {
  const now = useCurrentMinute();

  const readLowStockCount = useCallback(() => {
    const { medStocks, intakes, intakeLogs } = getStocksData(database, now);
    return computeStockItems(medStocks, intakes, intakeLogs, now).filter(
      ({ forecast }) => forecast.status === "low",
    ).length;
  }, [now]);

  return useSyncExternalStore(subscribeToDatabaseChanges, readLowStockCount);
}
