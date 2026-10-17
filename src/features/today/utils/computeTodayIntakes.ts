import type { Intake, Weekday } from "@/domain/intake";
import { fromLocalDateTime, type IntakeLog } from "@/domain/intakeLog";

import type { IntakeValidation, TodaySections } from "./todayTypes";

export const LATE_THRESHOLD_MINUTES = 60;

const MILLISECONDS_PER_MINUTE = 60_000;

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

function toValidation({ status, expectedIntakeAt, createdAt }: IntakeLog): IntakeValidation {
  const expectedDate = fromLocalDateTime(expectedIntakeAt);
  const createdDate = fromLocalDateTime(createdAt);
  const minutesLate = (createdDate.getTime() - expectedDate.getTime()) / MILLISECONDS_PER_MINUTE;
  return {
    time: { hour: createdDate.getHours(), minute: createdDate.getMinutes() },
    isTakenLate: status === "taken" && minutesLate > LATE_THRESHOLD_MINUTES,
  };
}

export function computeTodayIntakes(
  intakes: Intake[],
  intakeLogs: IntakeLog[],
  now: Date,
): TodaySections {
  const sections: TodaySections = { late: [], next: null, later: [], earlier: [] };
  const logsByIntakeId = new Map(intakeLogs.map((intakeLog) => [intakeLog.intakeId, intakeLog]));

  for (const intake of intakes) {
    const minutes = minutesFromNow(intake.time, now);
    const intakeLog = logsByIntakeId.get(intake.id);
    if (intakeLog) {
      sections.earlier.push({
        intake,
        status: intakeLog.status,
        minutesFromNow: minutes,
        validation: toValidation(intakeLog),
      });
    } else if (minutes < -LATE_THRESHOLD_MINUTES) {
      sections.late.push({ intake, status: "late", minutesFromNow: minutes });
    } else if (sections.next === null) {
      sections.next = { intake, status: "next", minutesFromNow: minutes };
    } else {
      sections.later.push({ intake, status: "later", minutesFromNow: minutes });
    }
  }
  return sections;
}

export function countPendingIntakes({ late, next, later }: TodaySections): number {
  return late.length + (next ? 1 : 0) + later.length;
}

export function countPendingPastIntakes({ late, next }: TodaySections): number {
  return late.length + (next !== null && next.minutesFromNow <= 0 ? 1 : 0);
}

export function countTodayIntakes(sections: TodaySections): number {
  return countPendingIntakes(sections) + sections.earlier.length;
}

export function areAllIntakesHandled(sections: TodaySections): boolean {
  return sections.earlier.length > 0 && countPendingIntakes(sections) === 0;
}
