import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import { sortIntakeMeds, type Intake } from "@/domain/intake";
import { type IntakeLog, toLocalDate } from "@/domain/intakeLog";
import { database } from "@/shared/database/database";

import { useCurrentMinute } from "@/features/today/hooks/useCurrentMinute";
import { getIntakeLogsOfDay } from "@/features/today/queries/getIntakeLogsOfDay";
import { getTodayIntakes } from "@/features/today/queries/getTodayIntakes";
import {
  areAllIntakesHandled,
  computeTodayIntakes,
  countTodayIntakes,
  weekdayOf,
} from "@/features/today/utils/computeTodayIntakes";
import { formatTodaySummary } from "@/features/today/utils/formatters";
import type { TodaySections, TodaySummary } from "@/features/today/utils/todayTypes";

type TodayData = {
  date: Date;
  intakes: Intake[];
  sections: TodaySections;
  summary: TodaySummary | null;
  isEmpty: boolean;
  isAllHandled: boolean;
  refresh: () => void;
};

type StoredData = {
  localDate: string;
  intakes: Intake[];
  intakeLogs: IntakeLog[];
};

function readTodayData(date: Date): StoredData {
  return {
    localDate: toLocalDate(date),
    intakes: getTodayIntakes(database, weekdayOf(date)).map(sortIntakeMeds),
    intakeLogs: getIntakeLogsOfDay(database, toLocalDate(date)),
  };
}

export function useTodayData(): TodayData {
  const now = useCurrentMinute();
  const localDate = toLocalDate(now);
  const [storedData, setStoredData] = useState(() => readTodayData(now));

  const refresh = useCallback(() => {
    setStoredData(readTodayData(new Date()));
  }, []);

  useFocusEffect(refresh);

  if (storedData.localDate !== localDate) {
    setStoredData(readTodayData(now));
  }

  return useMemo(() => {
    const sections = computeTodayIntakes(storedData.intakes, storedData.intakeLogs, now);
    return {
      date: now,
      intakes: storedData.intakes,
      sections,
      summary: formatTodaySummary(sections),
      isEmpty: countTodayIntakes(sections) === 0,
      isAllHandled: areAllIntakesHandled(sections),
      refresh,
    };
  }, [storedData, now, refresh]);
}
