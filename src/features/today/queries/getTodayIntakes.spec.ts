import { sql } from "drizzle-orm";

import { intakeMedTable, intakeTable, medTable } from "@/shared/database/schema";
import { createTestDatabase } from "@/shared/database/testDatabase";

import { getTodayIntakes } from "./getTodayIntakes";

describe("getTodayIntakes", () => {
  it("returns the fixture intakes ordered by time", () => {
    const intakes = getTodayIntakes(createTestDatabase(), "tuesday");

    expect(intakes.map(({ time }) => time)).toEqual([
      { hour: 8, minute: 20 },
      { hour: 12, minute: 20 },
      { hour: 20, minute: 20 },
      { hour: 22, minute: 0 },
    ]);
  });

  it("assembles each intake with its meds", () => {
    const [morning] = getTodayIntakes(createTestDatabase(), "tuesday");

    expect(
      morning.medQuantities.map(({ med, quantity }) => [med.name, med.strength, quantity]),
    ).toEqual(
      expect.arrayContaining([
        ["Lithium", "250 mg", 1],
        ["Lamictal", "50 mg", 1],
      ]),
    );
    expect(morning.medQuantities[0].med.design.shape).toEqual(expect.any(String));
    expect(morning.medQuantities.map(({ med }) => [med.name, med.detail])).toEqual(
      expect.arrayContaining([
        ["Lithium", "Avec le repas"],
        ["Lamictal", ""],
      ]),
    );
  });

  it("keeps only the intakes planned on the given weekday", () => {
    const database = createTestDatabase();
    const { id: medId } = database.get<{ id: string }>(
      sql`SELECT ${medTable.id} AS id FROM ${medTable} LIMIT 1`,
    );
    const { id: intakeId } = database
      .insert(intakeTable)
      .values({ hour: 7, minute: 0, days: ["monday"], reminderIntervalMinutes: 5 })
      .returning({ id: intakeTable.id })
      .get();
    database.insert(intakeMedTable).values({ intakeId, medId, quantity: 1 }).run();

    expect(getTodayIntakes(database, "monday").map(({ id }) => id)).toContain(intakeId);
    expect(getTodayIntakes(database, "tuesday").map(({ id }) => id)).not.toContain(intakeId);
  });

  it("hides an archived intake", () => {
    const database = createTestDatabase();
    const { id: medId } = database.get<{ id: string }>(
      sql`SELECT ${medTable.id} AS id FROM ${medTable} LIMIT 1`,
    );
    const { id: intakeId } = database
      .insert(intakeTable)
      .values({
        hour: 7,
        minute: 0,
        days: ["monday"],
        reminderIntervalMinutes: 5,
        isArchived: true,
      })
      .returning({ id: intakeTable.id })
      .get();
    database.insert(intakeMedTable).values({ intakeId, medId, quantity: 1 }).run();

    expect(getTodayIntakes(database, "monday").map(({ id }) => id)).not.toContain(intakeId);
  });

  it("hides an intake without meds", () => {
    const database = createTestDatabase({ seed: false });
    database
      .insert(intakeTable)
      .values({ hour: 7, minute: 0, days: ["monday"], reminderIntervalMinutes: 5 })
      .run();

    expect(getTodayIntakes(database, "monday")).toEqual([]);
  });

  it("returns nothing when the database is empty", () => {
    expect(getTodayIntakes(createTestDatabase({ seed: false }), "monday")).toEqual([]);
  });
});
