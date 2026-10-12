import { resetDatabase } from "./resetDatabase";
import { intakeMedTable, intakeTable, medTable } from "./schema";
import { createTestDatabase } from "./testDatabase";
import { countRows } from "./testHelpers";

describe("resetDatabase", () => {
  it("restores the fixtures after changes", () => {
    const database = createTestDatabase();
    database.delete(intakeTable).run();

    resetDatabase(database);

    expect(countRows(database, medTable)).toBe(6);
    expect(countRows(database, intakeTable)).toBe(4);
    expect(countRows(database, intakeMedTable)).toBe(7);
  });

  it("seeds an empty database", () => {
    const database = createTestDatabase({ seed: false });

    resetDatabase(database);

    expect(countRows(database, medTable)).toBe(6);
  });
});
