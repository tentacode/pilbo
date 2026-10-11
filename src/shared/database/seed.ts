import { sql } from "drizzle-orm";

import { intakeFixtures, type MedFixtureKey, medFixtures } from "./fixtures";
import { intakeMedTable, intakeTable, medTable } from "./schema";
import type { Database } from "./types";

function hasMeds(database: Database): boolean {
  const result = database.get<{ count: number }>(sql`SELECT COUNT(*) AS count FROM ${medTable}`);
  return result.count > 0;
}

export function seedDatabase(database: Database): void {
  if (hasMeds(database)) {
    return;
  }

  database.transaction((transaction) => {
    const medIds = new Map<MedFixtureKey, string>();
    for (const [key, med] of Object.entries(medFixtures)) {
      const { id } = transaction.insert(medTable).values(med).returning({ id: medTable.id }).get();
      medIds.set(key as MedFixtureKey, id);
    }

    for (const { medQuantities, ...intake } of intakeFixtures) {
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
    }
  });
}
