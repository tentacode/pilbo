import { useCallback, useSyncExternalStore } from "react";

import { database, subscribeToDatabaseChanges } from "@/shared/database/database";

import { getStocksData } from "@/features/stocks/queries/getStocksData";
import { computeStockItems } from "@/features/stocks/utils/stockItems";
import { useCurrentMinute } from "@/features/today/hooks/useCurrentMinute";

export function useHasEmptyStock(): boolean {
  const now = useCurrentMinute();

  const readHasEmptyStock = useCallback(() => {
    const { medStocks, intakes, intakeLogs } = getStocksData(database, now);
    return computeStockItems(medStocks, intakes, intakeLogs, now).some(
      ({ stock, forecast }) => forecast.status === "low" && stock.quantity === 0,
    );
  }, [now]);

  return useSyncExternalStore(subscribeToDatabaseChanges, readHasEmptyStock);
}
