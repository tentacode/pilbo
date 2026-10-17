import { useCallback, useSyncExternalStore } from "react";

import { database, subscribeToDatabaseChanges } from "@/shared/database/database";

import { useCurrentMinute } from "@/features/today/hooks/useCurrentMinute";
import { getTodayData } from "@/features/today/queries/getTodayData";
import {
  computeTodayIntakes,
  countPendingPastIntakes,
} from "@/features/today/utils/computeTodayIntakes";

export function usePendingPastIntakeCount(): number {
  const now = useCurrentMinute();

  const readPendingPastIntakeCount = useCallback(() => {
    const { intakes, intakeLogs } = getTodayData(database, now);
    return countPendingPastIntakes(computeTodayIntakes(intakes, intakeLogs, now));
  }, [now]);

  return useSyncExternalStore(subscribeToDatabaseChanges, readPendingPastIntakeCount);
}
