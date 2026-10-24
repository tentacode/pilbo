import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { addDaysToLocalDate, toLocalDate } from "@/domain/intakeLog";
import { database } from "@/shared/database/database";

import { useCurrentMinute } from "@/features/today/hooks/useCurrentMinute";
import { getFirstHistoryDate } from "@/features/today/queries/getFirstHistoryDate";

export type DayNavigation = {
  today: string;
  displayedDate: string;
  isToday: boolean;
  previousDate: string | null;
  nextDate: string | null;
  showDate: (localDate: string) => void;
};

export function useDayNavigation(): DayNavigation {
  const today = toLocalDate(useCurrentMinute());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [firstHistoryDate, setFirstHistoryDate] = useState(() => getFirstHistoryDate(database));

  useFocusEffect(
    useCallback(() => {
      setFirstHistoryDate(getFirstHistoryDate(database));
    }, []),
  );

  const displayedDate = selectedDate !== null && selectedDate < today ? selectedDate : today;
  const previousDate = addDaysToLocalDate(displayedDate, -1);

  return {
    today,
    displayedDate,
    isToday: displayedDate === today,
    previousDate:
      firstHistoryDate !== null && previousDate >= firstHistoryDate ? previousDate : null,
    nextDate: displayedDate < today ? addDaysToLocalDate(displayedDate, 1) : null,
    showDate: (localDate) => setSelectedDate(localDate < today ? localDate : null),
  };
}
