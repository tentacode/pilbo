import { createTestDatabase } from "@/shared/database/testDatabase";

import { archiveIntake } from "./archiveIntake";
import { getAllIntakes } from "./getAllIntakes";
import { hasActiveIntakeWithOtherSound } from "./hasActiveIntakeWithOtherSound";
import { setAllActiveIntakesSound } from "./setAllActiveIntakesSound";

describe("hasActiveIntakeWithOtherSound", () => {
  it("finds an intake with another sound", () => {
    expect(hasActiveIntakeWithOtherSound(createTestDatabase(), "beep")).toBe(true);
  });

  it("finds nothing when every intake has the sound", () => {
    const database = createTestDatabase();
    setAllActiveIntakesSound(database, "drop");

    expect(hasActiveIntakeWithOtherSound(database, "drop")).toBe(false);
  });

  it("ignores the archived intakes", () => {
    const database = createTestDatabase();
    const night = getAllIntakes(database)[3];

    archiveIntake(database, night.id, new Date(2026, 9, 20));

    expect(hasActiveIntakeWithOtherSound(database, "beep")).toBe(false);
  });

  it("finds nothing without intakes", () => {
    expect(hasActiveIntakeWithOtherSound(createTestDatabase({ seed: false }), "beep")).toBe(false);
  });
});
