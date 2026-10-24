import { sql } from "drizzle-orm";

import { clearDatabase } from "./clearDatabase";
import {
  intakeLogTable,
  intakeMedTable,
  intakeTable,
  medLogTable,
  medTable,
  stockTable,
} from "./schema";
import { createTestDatabase } from "./testDatabase";
import { countRows } from "./testHelpers";

describe("clearDatabase", () => {
  it("deletes the meds, the intakes, their links, their logs and the stocks", () => {
    const database = createTestDatabase();
    const { id: medId } = database.get<{ id: string }>(
      sql`SELECT ${medTable.id} AS id FROM ${medTable} LIMIT 1`,
    );
    database.insert(medLogTable).values({ medId, takenAt: "2026-10-14T10:00" }).run();
    const { id: intakeId } = database.get<{ id: string }>(
      sql`SELECT ${intakeTable.id} AS id FROM ${intakeTable} LIMIT 1`,
    );
    database
      .insert(intakeLogTable)
      .values({
        intakeId,
        expectedIntakeAt: "2026-10-14T08:20",
        createdAt: "2026-10-14T09:05",
        status: "taken",
      })
      .run();

    clearDatabase(database);

    expect(countRows(database, medTable)).toBe(0);
    expect(countRows(database, intakeTable)).toBe(0);
    expect(countRows(database, intakeMedTable)).toBe(0);
    expect(countRows(database, intakeLogTable)).toBe(0);
    expect(countRows(database, medLogTable)).toBe(0);
    expect(countRows(database, stockTable)).toBe(0);
  });

  it("does nothing on an empty database", () => {
    const database = createTestDatabase({ seed: false });

    clearDatabase(database);

    expect(countRows(database, medTable)).toBe(0);
  });
});
