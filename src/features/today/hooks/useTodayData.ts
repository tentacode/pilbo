import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import type { Intake } from "@/domain/intake";
import { fromLocalDateTime, toLocalDate } from "@/domain/intakeLog";
import { database } from "@/shared/database/database";

import { useCurrentMinute } from "@/features/today/hooks/useCurrentMinute";
import { getTodayData } from "@/features/today/queries/getTodayData";
import { getUpcomingIntake } from "@/features/today/queries/getUpcomingIntake";
import {
  areAllIntakesHandled,
  computeTodayIntakes,
  countTodayIntakes,
} from "@/features/today/utils/computeTodayIntakes";
import type {
  AsNeededMedOfDay,
  TodaySections,
  UpcomingIntake,
} from "@/features/today/utils/todayTypes";

type TodayData = {
  date: Date;
  intakes: Intake[];
  sections: TodaySections;
  asNeededMeds: AsNeededMedOfDay[];
  isEmpty: boolean;
  upcomingIntake: UpcomingIntake | null;
  isAllHandled: boolean;
  refresh: () => void;
};

export function useTodayData(): TodayData {
  const now = useCurrentMinute();
  const localDate = toLocalDate(now);
  const [storedData, setStoredData] = useState(() => getTodayData(database, now));

  const refresh = useCallback(() => {
    setStoredData(getTodayData(database, new Date()));
  }, []);

  useFocusEffect(refresh);

  if (storedData.localDate !== localDate) {
    setStoredData(getTodayData(database, now));
  }

  const upcomingIntake = useMemo(
    () =>
      storedData.intakes.length === 0
        ? getUpcomingIntake(database, fromLocalDateTime(`${storedData.localDate}T00:00`))
        : null,
    [storedData],
  );

  return useMemo(() => {
    const sections = computeTodayIntakes(storedData.intakes, storedData.intakeLogs, now);
    return {
      date: now,
      intakes: storedData.intakes,
      sections,
      asNeededMeds: storedData.asNeededMeds,
      isEmpty: countTodayIntakes(sections) === 0,
      upcomingIntake,
      isAllHandled: areAllIntakesHandled(sections),
      refresh,
    };
  }, [storedData, now, upcomingIntake, refresh]);
}
