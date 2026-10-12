import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import { sortIntakeMeds, type Intake, type Weekday } from "@/domain/intake";
import { database } from "@/shared/database/database";

import { useCurrentMinute } from "@/features/today/hooks/useCurrentMinute";
import { getTodayIntakes } from "@/features/today/queries/getTodayIntakes";
import {
  computeTodayIntakes,
  countTodayIntakes,
  weekdayOf,
} from "@/features/today/utils/computeTodayIntakes";
import { formatTodaySummary } from "@/features/today/utils/formatters";
import type { TodaySections, TodaySummary } from "@/features/today/utils/todayTypes";

type TodayData = {
  date: Date;
  sections: TodaySections;
  summary: TodaySummary | null;
  isEmpty: boolean;
};

function readTodayIntakes(weekday: Weekday): Intake[] {
  return getTodayIntakes(database, weekday).map(sortIntakeMeds);
}

export function useTodayData(): TodayData {
  const now = useCurrentMinute();
  const weekday = weekdayOf(now);
  const [intakes, setIntakes] = useState(() => readTodayIntakes(weekday));

  useFocusEffect(
    useCallback(() => {
      setIntakes(readTodayIntakes(weekday));
    }, [weekday]),
  );

  return useMemo(() => {
    const sections = computeTodayIntakes(intakes, now);
    return {
      date: now,
      sections,
      summary: formatTodaySummary(sections),
      isEmpty: countTodayIntakes(sections) === 0,
    };
  }, [intakes, now]);
}
