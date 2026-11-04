import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import { toLocalDate } from "@/domain/intakeLog";
import { database } from "@/shared/database/database";

import { getMedsData } from "@/features/meds/queries/getMedsData";
import { computeMedListItems } from "@/features/meds/utils/medListItems";
import type { MedListItem } from "@/features/meds/utils/medsTypes";
import { useCurrentMinute } from "@/features/today/hooks/useCurrentMinute";

export function useMedsData(): MedListItem[] {
  const now = useCurrentMinute();
  const localDate = toLocalDate(now);
  const [storedData, setStoredData] = useState(() => getMedsData(database, now));

  useFocusEffect(
    useCallback(() => {
      setStoredData(getMedsData(database, new Date()));
    }, []),
  );

  if (storedData.localDate !== localDate) {
    setStoredData(getMedsData(database, now));
  }

  return useMemo(() => {
    const { meds, medStocks, intakes, intakeLogs } = storedData;
    return computeMedListItems(meds, medStocks, intakes, intakeLogs, now);
  }, [storedData, now]);
}
