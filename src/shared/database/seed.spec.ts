import { sql } from "drizzle-orm";

import { intakeLogTable, intakeMedTable, intakeTable, medTable } from "./schema";
import { seedDatabase } from "./seed";
import { createTestDatabase } from "./testDatabase";
import { countRows } from "./testHelpers";

describe("seedDatabase", () => {
  it("inserts the meds, the intakes and their links", () => {
    const database = createTestDatabase();

    expect(countRows(database, medTable)).toBe(6);
    expect(countRows(database, intakeTable)).toBe(4);
    expect(countRows(database, intakeMedTable)).toBe(7);
  });

  it("does not seed again when the database already has meds", () => {
    const database = createTestDatabase();

    seedDatabase(database, { withLogs: false });

    expect(countRows(database, medTable)).toBe(6);
    expect(countRows(database, intakeTable)).toBe(4);
  });

  it("generates UUIDs as identifiers", () => {
    const database = createTestDatabase();

    const { id } = database.get<{ id: string }>(
      sql`SELECT ${medTable.id} AS id FROM ${medTable} LIMIT 1`,
    );

    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it("inserts no log by default", () => {
    expect(countRows(createTestDatabase(), intakeLogTable)).toBe(0);
  });

  it("inserts the late morning log of the day with logs", () => {
    const database = createTestDatabase({ withLogs: true, now: new Date(2026, 9, 14, 7, 0) });

    const logs = database.all<{
      hour: number;
      expectedIntakeAt: string;
      createdAt: string;
      status: string;
    }>(sql`
      SELECT
        ${intakeTable.hour} AS hour,
        ${intakeLogTable.expectedIntakeAt} AS expectedIntakeAt,
        ${intakeLogTable.createdAt} AS createdAt,
        ${intakeLogTable.status} AS status
      FROM ${intakeLogTable}
      INNER JOIN ${intakeTable} ON ${intakeTable.id} = ${intakeLogTable.intakeId}
    `);

    expect(logs).toEqual([
      {
        hour: 8,
        expectedIntakeAt: "2026-10-14T08:20",
        createdAt: "2026-10-14T09:05",
        status: "taken",
      },
    ]);
  });
});
