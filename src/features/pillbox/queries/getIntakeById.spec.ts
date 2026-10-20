import { createTestDatabase } from "@/shared/database/testDatabase";

import { archiveIntake } from "./archiveIntake";
import { getAllIntakes } from "./getAllIntakes";
import { getIntakeById } from "./getIntakeById";

describe("getIntakeById", () => {
  it("returns the intake with its meds", () => {
    const database = createTestDatabase();
    const [morning] = getAllIntakes(database);

    expect(getIntakeById(database, morning.id)).toEqual(morning);
  });

  it("returns undefined for an unknown intake", () => {
    expect(getIntakeById(createTestDatabase(), "unknown")).toBeUndefined();
  });

  it("returns undefined for an archived intake", () => {
    const database = createTestDatabase();
    const [morning] = getAllIntakes(database);

    archiveIntake(database, morning.id);

    expect(getIntakeById(database, morning.id)).toBeUndefined();
  });
});
