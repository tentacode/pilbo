import { sql } from "drizzle-orm";

import { type Intake, intakeDateOn } from "@/domain/intake";
import { addDays, toLocalDate, toLocalDateTime } from "@/domain/intakeLog";

import {
  asNeededLogFixture,
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
  createdOn: string;
  archivedOn: string | null;
};

const MILLISECONDS_PER_MINUTE = 60_000;

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
  intake: NewIntakeRow,
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
    createdOn: intake.createdOn,
    archivedOn: intake.archivedOn ?? null,
  };
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
    ({ createdOn, archivedOn }) =>
      createdOn <= localDate && (archivedOn === null || archivedOn > localDate),
  );
  const loggedVersions = kind === "partlyForgotten" ? versionsOfDay.slice(0, -1) : versionsOfDay;
  return loggedVersions.map(({ id, time }, index) => ({
    intakeId: id,
    status: kind === "allSkipped" ? "skipped" : "taken",
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
      asNeededLogFixture.daysAgo.map((daysAgo) => ({
        medId: medIds.get(asNeededLogFixture.med) as string,
        takenAt: `${toLocalDate(addDays(now, -daysAgo))}T${asNeededLogFixture.time}`,
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
      let createdOn = historyStart;

      if (withLogs && intakeFixture === intakeVersionFixture.intake) {
        const archivedOn = toLocalDate(addDays(now, -intakeVersionFixture.daysAgo));
        const previousIntake = {
          ...intake,
          ...intakeVersionFixture.previousTime,
          createdOn,
          isArchived: true,
          archivedOn,
        };
        versions.push(insertVersion(transaction, previousIntake, medQuantities, medIds));
        createdOn = archivedOn;
      }

      const version = insertVersion(transaction, { ...intake, createdOn }, medQuantities, medIds);
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
