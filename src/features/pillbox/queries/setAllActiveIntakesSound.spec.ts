import { sql } from "drizzle-orm";

import { intakeTable } from "@/shared/database/schema";
import { createTestDatabase } from "@/shared/database/testDatabase";
import { countRows } from "@/shared/database/testHelpers";

import { archiveIntake } from "./archiveIntake";
import { getAllIntakes } from "./getAllIntakes";
import { setAllActiveIntakesSound } from "./setAllActiveIntakesSound";

describe("setAllActiveIntakesSound", () => {
  it("sets the sound of every active intake in place", () => {
    const database = createTestDatabase();
    const intakesBefore = countRows(database, intakeTable);

    setAllActiveIntakesSound(database, "chime");

    expect(getAllIntakes(database).map(({ sound }) => sound)).toEqual(Array(4).fill("chime"));
    expect(countRows(database, intakeTable)).toBe(intakesBefore);
  });

  it("keeps the sound of the archived intakes", () => {
    const database = createTestDatabase();
    const night = getAllIntakes(database)[3];
    archiveIntake(database, night.id, new Date(2026, 9, 20));

    setAllActiveIntakesSound(database, "chime");

    expect(
      database.all<{ sound: string }>(sql`
        SELECT ${intakeTable.sound} AS sound
        FROM ${intakeTable}
        WHERE ${intakeTable.isArchived} = 1
      `),
    ).toEqual([{ sound: "nocturne" }]);
  });
});
