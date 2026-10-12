import { clearDatabase } from "./clearDatabase";
import { intakeMedTable, intakeTable, medTable } from "./schema";
import { createTestDatabase } from "./testDatabase";
import { countRows } from "./testHelpers";

describe("clearDatabase", () => {
  it("deletes the meds, the intakes and their links", () => {
    const database = createTestDatabase();

    clearDatabase(database);

    expect(countRows(database, medTable)).toBe(0);
    expect(countRows(database, intakeTable)).toBe(0);
    expect(countRows(database, intakeMedTable)).toBe(0);
  });

  it("does nothing on an empty database", () => {
    const database = createTestDatabase({ seed: false });

    clearDatabase(database);

    expect(countRows(database, medTable)).toBe(0);
  });
});
