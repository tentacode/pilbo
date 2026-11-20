import type { Weekday } from "@/domain/intake";
import { intakeMedTable, intakeTable, type NewIntakeRow } from "@/shared/database/schema";
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
  recurrence: Partial<Pick<NewIntakeRow, "frequency" | "interval" | "startsOn">> = {},
): string {
  const { id: medId } = insertMed(database, {
    name: "Lithium",
    strength: "250 mg",
    detail: "",
    design: { shape: "round", colors: ["#FFFFFF", "#FFFFFF"], size: "medium" },
  });
  const { id: intakeId } = database
    .insert(intakeTable)
    .values({
      hour,
      minute: 15,
      days,
      reminderIntervalMinutes: 5,
      isArchived,
      createdOn: "2026-10-01",
      archivedOn: isArchived ? "2026-10-20" : null,
      startsOn: "2026-10-01",
      ...recurrence,
    })
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

  it("skips an intake in a paused week", () => {
    const database = createTestDatabase({ seed: false });
    insertIntake(database, ["monday"], 8, false, {
      frequency: "weekly",
      interval: 2,
      startsOn: "2026-10-19",
    });
    const intakeId = insertIntake(database, ["thursday"], 9);

    expect(getUpcomingIntake(database, SATURDAY)).toEqual(
      expect.objectContaining({ daysAhead: 5, intake: expect.objectContaining({ id: intakeId }) }),
    );
  });

  it("finds a monthly intake tomorrow", () => {
    const database = createTestDatabase({ seed: false });
    const intakeId = insertIntake(database, [], 8, false, {
      frequency: "monthly",
      interval: 1,
      startsOn: "2026-09-25",
    });

    expect(getUpcomingIntake(database, SATURDAY)).toEqual(
      expect.objectContaining({ daysAhead: 1, intake: expect.objectContaining({ id: intakeId }) }),
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
