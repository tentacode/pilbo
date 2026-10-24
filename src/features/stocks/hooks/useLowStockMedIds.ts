import { useCallback, useMemo, useSyncExternalStore } from "react";

import { database, subscribeToDatabaseChanges } from "@/shared/database/database";

import { getStocksData } from "@/features/stocks/queries/getStocksData";
import { computeStockItems } from "@/features/stocks/utils/stockSections";
import { useCurrentMinute } from "@/features/today/hooks/useCurrentMinute";

const MED_ID_SEPARATOR = ",";

export function useLowStockMedIds(): string[] {
  const now = useCurrentMinute();

  // The snapshot must stay a primitive: a new array on each read would loop the renders.
  const readLowStockMedIds = useCallback(() => {
    const { medStocks, intakes, intakeLogs } = getStocksData(database, now);
    return computeStockItems(medStocks, intakes, intakeLogs, now)
      .filter(({ forecast }) => forecast.status === "low")
      .map(({ med }) => med.id)
      .sort()
      .join(MED_ID_SEPARATOR);
  }, [now]);

  const lowStockMedIds = useSyncExternalStore(subscribeToDatabaseChanges, readLowStockMedIds);

  return useMemo(
    () => (lowStockMedIds === "" ? [] : lowStockMedIds.split(MED_ID_SEPARATOR)),
    [lowStockMedIds],
  );
}
