import { sql } from "drizzle-orm";

import { intakeLogTable, intakeTable } from "@/shared/database/schema";
import { createTestDatabase } from "@/shared/database/testDatabase";
import { countRows } from "@/shared/database/testHelpers";

import { archiveIntake } from "./archiveIntake";
import { getAllIntakes } from "./getAllIntakes";

describe("archiveIntake", () => {
  it("hides the intake, archived today, and keeps its row and its logs", () => {
    const database = createTestDatabase({ withLogs: true });
    const [morning] = getAllIntakes(database);
    const logsBefore = countRows(database, intakeLogTable);
    const intakesBefore = countRows(database, intakeTable);

    archiveIntake(database, morning.id, new Date(2026, 9, 24, 9, 0));

    expect(getAllIntakes(database).map(({ id }) => id)).not.toContain(morning.id);
    expect(countRows(database, intakeTable)).toBe(intakesBefore);
    expect(countRows(database, intakeLogTable)).toBe(logsBefore);
    const version = database.get<{ isArchived: number; archivedOn: string }>(sql`
      SELECT
        ${intakeTable.isArchived} AS isArchived,
        ${intakeTable.archivedOn} AS archivedOn
      FROM ${intakeTable}
      WHERE ${intakeTable.id} = ${morning.id}
    `);
    expect(version).toEqual({ isArchived: 1, archivedOn: "2026-10-24" });
  });
});
