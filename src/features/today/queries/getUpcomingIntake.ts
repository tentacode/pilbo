import type { Database } from "@/shared/database/types";

import { weekdayOf } from "@/features/today/utils/computeTodayIntakes";
import type { UpcomingIntake } from "@/features/today/utils/todayTypes";
import { getTodayIntakes } from "./getTodayIntakes";

const DAYS_PER_WEEK = 7;

export function getUpcomingIntake(database: Database, today: Date): UpcomingIntake | null {
  for (let daysAhead = 1; daysAhead <= DAYS_PER_WEEK; daysAhead++) {
    const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysAhead);
    const weekday = weekdayOf(day);
    const [intake] = getTodayIntakes(database, weekday);
    if (intake) {
      return { daysAhead, weekday, intake };
    }
  }
  return null;
}
