import { addDays } from "@/domain/intakeLog";
import type { Database } from "@/shared/database/types";

import { weekdayOf } from "@/features/today/utils/computeTodayIntakes";
import type { UpcomingIntake } from "@/features/today/utils/todayTypes";
import { getIntakesOfDay } from "./getIntakesOfDay";

const DAYS_PER_WEEK = 7;

export function getUpcomingIntake(database: Database, today: Date): UpcomingIntake | null {
  for (let daysAhead = 1; daysAhead <= DAYS_PER_WEEK; daysAhead++) {
    const day = addDays(today, daysAhead);
    const [intake] = getIntakesOfDay(database, day);
    if (intake) {
      return { daysAhead, weekday: weekdayOf(day), intake };
    }
  }
  return null;
}
