import type { Weekday } from "@/domain/intake";
import { intakeMedTable, intakeTable } from "@/shared/database/schema";
import { createTestDatabase } from "@/shared/database/testDatabase";
import type { Database } from "@/shared/database/types";

import { insertMed } from "@/features/pillbox/queries/insertMed";
import { getUpcomingIntake } from "./getUpcomingIntake";

const SATURDAY = new Date(2026, 9, 24);

function insertIntake(
  database: Database,
  days: Weekday[],
  hour: number,
  isArchived = false,
): string {
  const { id: medId } = insertMed(database, {
    name: "Lithium",
    strength: "250 mg",
    detail: "",
    design: { shape: "round", colors: ["#FFFFFF", "#FFFFFF"], size: "medium" },
    isAsNeeded: false,
  });
  const { id: intakeId } = database
    .insert(intakeTable)
    .values({ hour, minute: 15, days, reminderIntervalMinutes: 5, isArchived })
    .returning({ id: intakeTable.id })
    .get();
  database.insert(intakeMedTable).values({ intakeId, medId, quantity: 1 }).run();
  return intakeId;
}

describe("getUpcomingIntake", () => {
  it("returns the earliest intake of the first following day with intakes", () => {
    const database = createTestDatabase({ seed: false });
    insertIntake(database, ["tuesday"], 7);
    insertIntake(database, ["monday"], 20);
    const intakeId = insertIntake(database, ["monday"], 9);

    expect(getUpcomingIntake(database, SATURDAY)).toEqual({
      daysAhead: 2,
      weekday: "monday",
      intake: expect.objectContaining({ id: intakeId, time: { hour: 9, minute: 15 } }),
    });
  });

  it("finds an intake on the same weekday next week", () => {
    const database = createTestDatabase({ seed: false });
    insertIntake(database, ["saturday"], 8);

    expect(getUpcomingIntake(database, SATURDAY)).toEqual(
      expect.objectContaining({ daysAhead: 7, weekday: "saturday" }),
    );
  });

  it("ignores an archived intake", () => {
    const database = createTestDatabase({ seed: false });
    insertIntake(database, ["sunday"], 8, true);

    expect(getUpcomingIntake(database, SATURDAY)).toBeNull();
  });

  it("returns nothing when the database is empty", () => {
    expect(getUpcomingIntake(createTestDatabase({ seed: false }), SATURDAY)).toBeNull();
  });
});
