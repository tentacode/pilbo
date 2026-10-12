import type { Intake, Weekday } from "@/domain/intake";

import type { TodaySections } from "./todayTypes";

export const LATE_THRESHOLD_MINUTES = 30;

const WEEKDAYS_FROM_SUNDAY: readonly Weekday[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export function weekdayOf(date: Date): Weekday {
  return WEEKDAYS_FROM_SUNDAY[date.getDay()];
}

function minutesFromNow({ hour, minute }: Intake["time"], now: Date): number {
  return hour * 60 + minute - (now.getHours() * 60 + now.getMinutes());
}

export function computeTodayIntakes(intakes: Intake[], now: Date): TodaySections {
  const sections: TodaySections = { late: [], next: null, later: [] };

  for (const intake of intakes) {
    const minutes = minutesFromNow(intake.time, now);
    if (minutes < -LATE_THRESHOLD_MINUTES) {
      sections.late.push({ intake, status: "late", minutesFromNow: minutes });
    } else if (sections.next === null) {
      sections.next = { intake, status: "next", minutesFromNow: minutes };
    } else {
      sections.later.push({ intake, status: "later", minutesFromNow: minutes });
    }
  }
  return sections;
}

export function countTodayIntakes({ late, next, later }: TodaySections): number {
  return late.length + (next ? 1 : 0) + later.length;
}
