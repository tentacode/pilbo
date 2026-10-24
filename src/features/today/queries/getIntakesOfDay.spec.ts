import { sql } from "drizzle-orm";

import type { Weekday } from "@/domain/intake";
import { intakeMedTable, intakeTable, medTable, type NewIntakeRow } from "@/shared/database/schema";
import { createTestDatabase } from "@/shared/database/testDatabase";
import type { Database } from "@/shared/database/types";

import { getAllIntakes } from "@/features/pillbox/queries/getAllIntakes";
import { saveIntake } from "@/features/pillbox/queries/saveIntake";
import { getIntakesOfDay } from "./getIntakesOfDay";
import { insertIntakeLog } from "./insertIntakeLog";

const MONDAY = new Date(2026, 9, 19);
const TUESDAY = new Date(2026, 9, 20);

function insertIntake(
  database: Database,
  version: Partial<Pick<NewIntakeRow, "createdOn" | "archivedOn" | "isArchived">> & {
    days?: Weekday[];
  } = {},
): string {
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
      createdOn: "2026-10-01",
      ...version,
    })
    .returning({ id: intakeTable.id })
    .get();
  database.insert(intakeMedTable).values({ intakeId, medId, quantity: 1 }).run();
  return intakeId;
}

function intakeIdsOn(database: Database, date: Date): string[] {
  return getIntakesOfDay(database, date).map(({ id }) => id);
}

describe("getIntakesOfDay", () => {
  it("returns the fixture intakes ordered by time", () => {
    const intakes = getIntakesOfDay(createTestDatabase(), TUESDAY);

    expect(intakes.map(({ time }) => time)).toEqual([
      { hour: 8, minute: 20 },
      { hour: 12, minute: 20 },
      { hour: 20, minute: 20 },
      { hour: 22, minute: 0 },
    ]);
  });

  it("assembles each intake with its meds", () => {
    const [morning] = getIntakesOfDay(createTestDatabase(), TUESDAY);

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

  it("keeps only the intakes planned on the weekday of the date", () => {
    const database = createTestDatabase();
    const intakeId = insertIntake(database);

    expect(intakeIdsOn(database, MONDAY)).toContain(intakeId);
    expect(intakeIdsOn(database, TUESDAY)).not.toContain(intakeId);
  });

  it("keeps an intake from the day it was created", () => {
    const database = createTestDatabase();
    const intakeId = insertIntake(database, { createdOn: "2026-10-19" });

    expect(intakeIdsOn(database, new Date(2026, 9, 12))).not.toContain(intakeId);
    expect(intakeIdsOn(database, MONDAY)).toContain(intakeId);
  });

  it("keeps an archived intake until the day before its archiving", () => {
    const database = createTestDatabase();
    const intakeId = insertIntake(database, { isArchived: true, archivedOn: "2026-10-19" });

    expect(intakeIdsOn(database, new Date(2026, 9, 12))).toContain(intakeId);
    expect(intakeIdsOn(database, MONDAY)).not.toContain(intakeId);
    expect(intakeIdsOn(database, new Date(2026, 9, 26))).not.toContain(intakeId);
  });

  it("returns the version of an edited intake that covers the date", () => {
    const database = createTestDatabase();
    const [morning] = getAllIntakes(database);
    insertIntakeLog(database, {
      intakeId: morning.id,
      expectedIntakeAt: "2026-10-12T08:20",
      createdAt: "2026-10-12T08:25",
      status: "taken",
    });
    const newIntakeId = saveIntake(
      database,
      {
        id: morning.id,
        time: { hour: 9, minute: 0 },
        days: morning.days,
        reminderIntervalMinutes: morning.reminderIntervalMinutes,
        medQuantities: morning.medQuantities.map(({ med, quantity }) => ({
          medId: med.id,
          quantity,
        })),
      },
      MONDAY,
    );

    const lastWeekIds = intakeIdsOn(database, new Date(2026, 9, 12));
    expect(lastWeekIds).toContain(morning.id);
    expect(lastWeekIds).not.toContain(newIntakeId);
    const todayIds = intakeIdsOn(database, MONDAY);
    expect(todayIds).toContain(newIntakeId);
    expect(todayIds).not.toContain(morning.id);
  });

  it("hides an intake without meds", () => {
    const database = createTestDatabase({ seed: false });
    database
      .insert(intakeTable)
      .values({
        hour: 7,
        minute: 0,
        days: ["monday"],
        reminderIntervalMinutes: 5,
        createdOn: "2026-10-01",
      })
      .run();

    expect(getIntakesOfDay(database, MONDAY)).toEqual([]);
  });

  it("returns nothing when the database is empty", () => {
    expect(getIntakesOfDay(createTestDatabase({ seed: false }), MONDAY)).toEqual([]);
  });
});
