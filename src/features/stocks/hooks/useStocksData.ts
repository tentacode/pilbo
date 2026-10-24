import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import { toLocalDate } from "@/domain/intakeLog";
import { database } from "@/shared/database/database";

import { getStocksData } from "@/features/stocks/queries/getStocksData";
import { computeStockItems, splitStockSections } from "@/features/stocks/utils/stockSections";
import type { StockSections } from "@/features/stocks/utils/stockTypes";
import { useCurrentMinute } from "@/features/today/hooks/useCurrentMinute";

type StocksData = {
  sections: StockSections;
  isEmpty: boolean;
};

export function useStocksData(): StocksData {
  const now = useCurrentMinute();
  const localDate = toLocalDate(now);
  const [storedData, setStoredData] = useState(() => getStocksData(database, now));

  useFocusEffect(
    useCallback(() => {
      setStoredData(getStocksData(database, new Date()));
    }, []),
  );

  if (storedData.localDate !== localDate) {
    setStoredData(getStocksData(database, now));
  }

  return useMemo(() => {
    const { medStocks, intakes, intakeLogs } = storedData;
    return {
      sections: splitStockSections(computeStockItems(medStocks, intakes, intakeLogs, now)),
      isEmpty: medStocks.length === 0,
    };
  }, [storedData, now]);
}
