import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import { sortIntakeMeds } from "@/domain/intake";
import { toLocalDate } from "@/domain/intakeLog";
import { database } from "@/shared/database/database";

import { getMedSheetData } from "@/features/meds/queries/getMedSheetData";
import { computeStockForecast } from "@/features/stocks/utils/stockForecast";
import { useCurrentMinute } from "@/features/today/hooks/useCurrentMinute";

export function useMedSheetData(medId: string) {
  const now = useCurrentMinute();
  const localDate = toLocalDate(now);
  const [storedData, setStoredData] = useState(() => getMedSheetData(database, medId, now));

  const refresh = useCallback(() => {
    setStoredData(getMedSheetData(database, medId, new Date()));
  }, [medId]);

  useFocusEffect(refresh);

  if (storedData.localDate !== localDate) {
    setStoredData(getMedSheetData(database, medId, now));
  }

  return useMemo(() => {
    const { med, stock, intakes, intakeLogs, takingSummary } = storedData;
    return {
      now,
      med,
      intakes: intakes.map(sortIntakeMeds),
      stockStatus:
        stock === undefined
          ? undefined
          : { stock, forecast: computeStockForecast(stock, intakes, intakeLogs, now) },
      takingSummary,
      refresh,
    };
  }, [storedData, now, refresh]);
}
