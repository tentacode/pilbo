import { sql } from "drizzle-orm";

import { intakeMedTable, intakeTable, medTable } from "./schema";
import { seedDatabase } from "./seed";
import { createTestDatabase } from "./testDatabase";
import type { Database } from "./types";

function countRows(
  database: Database,
  table: typeof medTable | typeof intakeTable | typeof intakeMedTable,
) {
  return database.get<{ count: number }>(sql`SELECT COUNT(*) AS count FROM ${table}`).count;
}

describe("seedDatabase", () => {
  it("inserts the meds, the intakes and their links", () => {
    const database = createTestDatabase();

    expect(countRows(database, medTable)).toBe(6);
    expect(countRows(database, intakeTable)).toBe(4);
    expect(countRows(database, intakeMedTable)).toBe(7);
  });

  it("does not seed again when the database already has meds", () => {
    const database = createTestDatabase();

    seedDatabase(database);

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
});
