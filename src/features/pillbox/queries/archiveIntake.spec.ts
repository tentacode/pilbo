import { sql } from "drizzle-orm";

import { intakeLogTable, intakeTable } from "@/shared/database/schema";
import { createTestDatabase } from "@/shared/database/testDatabase";
import { countRows } from "@/shared/database/testHelpers";

import { archiveIntake } from "./archiveIntake";
import { getAllIntakes } from "./getAllIntakes";

describe("archiveIntake", () => {
  it("hides the intake and keeps its row and its logs", () => {
    const database = createTestDatabase({ withLogs: true });
    const [morning] = getAllIntakes(database);

    archiveIntake(database, morning.id);

    expect(getAllIntakes(database).map(({ id }) => id)).not.toContain(morning.id);
    expect(countRows(database, intakeTable)).toBe(4);
    expect(countRows(database, intakeLogTable)).toBe(1);
    const { isArchived } = database.get<{ isArchived: number }>(
      sql`SELECT ${intakeTable.isArchived} AS isArchived FROM ${intakeTable} WHERE ${intakeTable.id} = ${morning.id}`,
    );
    expect(isArchived).toBe(1);
  });
});
