import { sql } from "drizzle-orm";

import { intakeDateOn } from "@/domain/intake";
import { toLocalDateTime } from "@/domain/intakeLog";

import { intakeFixtures, intakeLogFixture, type MedFixtureKey, medFixtures } from "./fixtures";
import { intakeLogTable, intakeMedTable, intakeTable, medTable } from "./schema";
import type { Database } from "./types";

export type SeedOptions = {
  withLogs: boolean;
  now?: Date;
};

const MILLISECONDS_PER_MINUTE = 60_000;

function hasMeds(database: Database): boolean {
  const result = database.get<{ count: number }>(sql`SELECT COUNT(*) AS count FROM ${medTable}`);
  return result.count > 0;
}

function intakeLogFixtureDates(now: Date): { expectedIntakeAt: string; createdAt: string } {
  const { hour, minute } = intakeLogFixture.intake;
  const expectedDate = intakeDateOn(now, { hour, minute });
  const createdDate = new Date(
    expectedDate.getTime() + intakeLogFixture.minutesAfterExpected * MILLISECONDS_PER_MINUTE,
  );
  return {
    expectedIntakeAt: toLocalDateTime(expectedDate),
    createdAt: toLocalDateTime(createdDate),
  };
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

    for (const intakeFixture of intakeFixtures) {
      const { medQuantities, ...intake } = intakeFixture;
      const { id: intakeId } = transaction
        .insert(intakeTable)
        .values(intake)
        .returning({ id: intakeTable.id })
        .get();

      transaction
        .insert(intakeMedTable)
        .values(
          medQuantities.map(({ med, quantity }) => ({
            intakeId,
            medId: medIds.get(med) as string,
            quantity,
          })),
        )
        .run();

      if (withLogs && intakeFixture === intakeLogFixture.intake) {
        transaction
          .insert(intakeLogTable)
          .values({ intakeId, status: intakeLogFixture.status, ...intakeLogFixtureDates(now) })
          .run();
      }
    }
  });
}
