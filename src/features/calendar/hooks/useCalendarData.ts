import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import { toLocalDate } from "@/domain/intakeLog";
import { database } from "@/shared/database/database";

import { getMonthHistory } from "@/features/calendar/queries/getMonthHistory";
import type { CalendarDay, Month } from "@/features/calendar/utils/calendarTypes";
import { computeMonthDays } from "@/features/calendar/utils/monthGrid";
import { compareMonths, monthOf } from "@/features/calendar/utils/months";
import { useCurrentMinute } from "@/features/today/hooks/useCurrentMinute";
import { getFirstHistoryDate } from "@/features/today/queries/getFirstHistoryDate";

type CalendarData = {
  month: Month;
  days: CalendarDay[];
  canShowPreviousMonth: boolean;
  canShowNextMonth: boolean;
  showMonth: (month: Month) => void;
};

function readMonth(month: Month) {
  return {
    month,
    history: getMonthHistory(database, month),
    firstHistoryDate: getFirstHistoryDate(database),
  };
}

export function useCalendarData(): CalendarData {
  const now = useCurrentMinute();
  const currentMonth = monthOf(toLocalDate(now));
  const [month, setMonth] = useState(currentMonth);
  const [storedData, setStoredData] = useState(() => readMonth(month));

  useFocusEffect(
    useCallback(() => {
      setStoredData(readMonth(month));
    }, [month]),
  );

  if (compareMonths(storedData.month, month) !== 0) {
    setStoredData(readMonth(month));
  }

  const { history, firstHistoryDate } = storedData;
  const days = useMemo(
    () => computeMonthDays(history, month, now, firstHistoryDate),
    [history, month, now, firstHistoryDate],
  );

  return {
    month,
    days,
    canShowPreviousMonth:
      firstHistoryDate !== null && compareMonths(month, monthOf(firstHistoryDate)) > 0,
    canShowNextMonth: compareMonths(month, currentMonth) < 0,
    showMonth: setMonth,
  };
}
