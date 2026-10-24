import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import { sortIntakeMeds } from "@/domain/intake";
import { fromLocalDate } from "@/domain/intakeLog";
import { database } from "@/shared/database/database";

import { getIntakeLogsOfDay } from "@/features/today/queries/getIntakeLogsOfDay";
import { getIntakesOfDay } from "@/features/today/queries/getIntakesOfDay";
import { getMedLogsOfDay } from "@/features/today/queries/getMedLogsOfDay";
import { computePastDayIntakes } from "@/features/today/utils/computeTodayIntakes";
import type { MedLogOfDay, TodayIntake } from "@/features/today/utils/todayTypes";

type DayData = {
  dayIntakes: TodayIntake[];
  medLogs: MedLogOfDay[];
};

function readDay(localDate: string) {
  return {
    localDate,
    intakes: getIntakesOfDay(database, fromLocalDate(localDate)).map(sortIntakeMeds),
    intakeLogs: getIntakeLogsOfDay(database, localDate),
    medLogs: getMedLogsOfDay(database, localDate),
  };
}

export function useDayData(localDate: string): DayData {
  const [storedData, setStoredData] = useState(() => readDay(localDate));

  const refresh = useCallback(() => {
    setStoredData(readDay(localDate));
  }, [localDate]);

  useFocusEffect(refresh);

  if (storedData.localDate !== localDate) {
    setStoredData(readDay(localDate));
  }

  return useMemo(
    () => ({
      dayIntakes: computePastDayIntakes(storedData.intakes, storedData.intakeLogs),
      medLogs: storedData.medLogs,
    }),
    [storedData],
  );
}
