import { sql } from "drizzle-orm";

import { type Intake, intakeDateOn, type IntakeRecurrence, type Weekday } from "@/domain/intake";
import { addDays, type IntakeLogStatus, toLocalDate, toLocalDateTime } from "@/domain/intakeLog";
import { isIntakeDueOn, mondayOf } from "@/domain/recurrence";

import {
  medLogFixture,
  HISTORY_DAYS,
  historyDayFixtures,
  type HistoryDayKind,
  historyLogFixture,
  type IntakeFixture,
  intakeFixtures,
  intakeLogFixture,
  intakeVersionFixture,
  type MedFixtureKey,
  medFixtures,
  stockFixtures,
  WEEKLY_START_WEEKS_AGO,
} from "./fixtures";
import {
  intakeLogTable,
  intakeMedTable,
  intakeTable,
  medLogTable,
  medTable,
  type NewIntakeLogRow,
  type NewIntakeRow,
  stockTable,
} from "./schema";
import type { Database } from "./types";

export type SeedOptions = {
  withLogs: boolean;
  now?: Date;
};

type SeededVersion = {
  id: string;
  time: Intake["time"];
  recurrence: IntakeRecurrence;
  createdOn: string;
  archivedOn: string | null;
};

const MILLISECONDS_PER_MINUTE = 60_000;
const DAYS_PER_WEEK = 7;

// Weekly fixtures are active during the current week, whatever the weekday.
function startsOnOf({ frequency }: IntakeFixture, historyStart: string, now: Date): string {
  return frequency === "weekly"
    ? toLocalDate(addDays(mondayOf(now), -WEEKLY_START_WEEKS_AGO * DAYS_PER_WEEK))
    : historyStart;
}

function hasMeds(database: Database): boolean {
  const result = database.get<{ count: number }>(sql`SELECT COUNT(*) AS count FROM ${medTable}`);
  return result.count > 0;
}

function logDates(
  day: Date,
  time: Intake["time"],
  minutesAfterExpected: number,
): { expectedIntakeAt: string; createdAt: string } {
  const expectedDate = intakeDateOn(day, time);
  const createdDate = new Date(
    expectedDate.getTime() + minutesAfterExpected * MILLISECONDS_PER_MINUTE,
  );
  return {
    expectedIntakeAt: toLocalDateTime(expectedDate),
    createdAt: toLocalDateTime(createdDate),
  };
}

function insertVersion(
  database: Database,
  intake: NewIntakeRow & { days: Weekday[] },
  medQuantities: IntakeFixture["medQuantities"],
  medIds: Map<MedFixtureKey, string>,
): SeededVersion {
  const { id } = database
    .insert(intakeTable)
    .values(intake)
    .returning({ id: intakeTable.id })
    .get();
  database
    .insert(intakeMedTable)
    .values(
      medQuantities.map(({ med, quantity }) => ({
        intakeId: id,
        medId: medIds.get(med) as string,
        quantity,
      })),
    )
    .run();
  return {
    id,
    time: { hour: intake.hour, minute: intake.minute },
    recurrence: {
      days: intake.days,
      frequency: intake.frequency ?? "daily",
      interval: intake.interval ?? 1,
      startsOn: intake.startsOn,
    },
    createdOn: intake.createdOn,
    archivedOn: intake.archivedOn ?? null,
  };
}

function historyLogStatus(kind: HistoryDayKind | undefined, isLastLog: boolean): IntakeLogStatus {
  if (kind === "allSkipped") {
    return "skipped";
  }
  return kind === "markedForgotten" && isLastLog ? "missed" : "taken";
}

function historyLogsOfDay(
  versions: SeededVersion[],
  day: Date,
  kind: HistoryDayKind | undefined,
): NewIntakeLogRow[] {
  if (kind === "allForgotten") {
    return [];
  }
  const localDate = toLocalDate(day);
  const versionsOfDay = versions.filter(
    ({ createdOn, archivedOn, recurrence }) =>
      createdOn <= localDate &&
      (archivedOn === null || archivedOn > localDate) &&
      isIntakeDueOn(recurrence, day),
  );
  const loggedVersions = kind === "partlyForgotten" ? versionsOfDay.slice(0, -1) : versionsOfDay;
  return loggedVersions.map(({ id, time }, index) => ({
    intakeId: id,
    status: historyLogStatus(kind, index === loggedVersions.length - 1),
    ...logDates(
      day,
      time,
      kind === "late" && index === 0
        ? historyLogFixture.lateMinutesAfterExpected
        : historyLogFixture.minutesAfterExpected,
    ),
  }));
}

function insertHistoryLogs(
  database: Database,
  versions: SeededVersion[],
  medIds: Map<MedFixtureKey, string>,
  now: Date,
): void {
  const intakeLogs: NewIntakeLogRow[] = [];
  for (let daysAgo = 1; daysAgo <= HISTORY_DAYS; daysAgo++) {
    intakeLogs.push(
      ...historyLogsOfDay(versions, addDays(now, -daysAgo), historyDayFixtures[daysAgo]),
    );
  }
  database.insert(intakeLogTable).values(intakeLogs).run();

  database
    .insert(medLogTable)
    .values(
      medLogFixture.daysAgo.map((daysAgo) => ({
        medId: medIds.get(medLogFixture.med) as string,
        takenAt: `${toLocalDate(addDays(now, -daysAgo))}T${medLogFixture.time}`,
      })),
    )
    .run();
}

export function seedDatabase(
  database: Database,
  { withLogs, now = new Date() }: SeedOptions,
): void {
  if (hasMeds(database)) {
    return;
  }

  database.transaction((transaction) => {
    const medIds = new Map<MedFixtureKey, string>();
    for (const [key, med] of Object.entries(medFixtures)) {
      const { id } = transaction.insert(medTable).values(med).returning({ id: medTable.id }).get();
      medIds.set(key as MedFixtureKey, id);
    }

    transaction
      .insert(stockTable)
      .values(
        stockFixtures.map(({ med, ...stock }) => ({ medId: medIds.get(med) as string, ...stock })),
      )
      .run();

    const historyStart = toLocalDate(addDays(now, -HISTORY_DAYS));
    const versions: SeededVersion[] = [];
    for (const intakeFixture of intakeFixtures) {
      const { medQuantities, ...intake } = intakeFixture;
      const startsOn = startsOnOf(intakeFixture, historyStart, now);
      let createdOn = historyStart;

      if (withLogs && intakeFixture === intakeVersionFixture.intake) {
        const archivedOn = toLocalDate(addDays(now, -intakeVersionFixture.daysAgo));
        const previousIntake = {
          ...intake,
          ...intakeVersionFixture.previousTime,
          createdOn,
          startsOn,
          isArchived: true,
          archivedOn,
        };
        versions.push(insertVersion(transaction, previousIntake, medQuantities, medIds));
        createdOn = archivedOn;
      }

      const version = insertVersion(
        transaction,
        { ...intake, createdOn, startsOn },
        medQuantities,
        medIds,
      );
      versions.push(version);

      if (withLogs && intakeFixture === intakeLogFixture.intake) {
        transaction
          .insert(intakeLogTable)
          .values({
            intakeId: version.id,
            status: intakeLogFixture.status,
            ...logDates(now, version.time, intakeLogFixture.minutesAfterExpected),
          })
          .run();
      }
    }

    if (withLogs) {
      insertHistoryLogs(transaction, versions, medIds, now);
    }
  });
}
