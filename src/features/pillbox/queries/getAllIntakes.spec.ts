import { WEEKDAYS } from "@/domain/intake";
import { intakeTable } from "@/shared/database/schema";
import { createTestDatabase } from "@/shared/database/testDatabase";

import { getAllIntakes } from "./getAllIntakes";

describe("getAllIntakes", () => {
  it("returns the intakes ordered by time", () => {
    const intakes = getAllIntakes(createTestDatabase());

    expect(intakes.map(({ time }) => time)).toEqual([
      { hour: 8, minute: 20 },
      { hour: 12, minute: 20 },
      { hour: 20, minute: 20 },
      { hour: 22, minute: 0 },
    ]);
  });

  it("assembles each intake with its days, reminder and meds", () => {
    const [morning] = getAllIntakes(createTestDatabase());

    expect(morning.days).toEqual([...WEEKDAYS]);
    expect(morning.reminderIntervalMinutes).toBe(10);
    expect(
      morning.medQuantities.map(({ med, quantity }) => [med.name, med.strength, quantity]),
    ).toEqual(
      expect.arrayContaining([
        ["Lithium", "250 mg", 1],
        ["Lamictal", "50 mg", 1],
      ]),
    );
    expect(morning.medQuantities[0].med.design.shape).toEqual(expect.any(String));
    expect(morning.medQuantities[0].med.isAsNeeded).toBe(false);
  });

  it("returns an intake without meds", () => {
    const database = createTestDatabase({ seed: false });
    database
      .insert(intakeTable)
      .values({ hour: 7, minute: 0, days: ["monday"], reminderIntervalMinutes: 5 })
      .run();

    expect(getAllIntakes(database)).toEqual([
      {
        id: expect.any(String),
        time: { hour: 7, minute: 0 },
        days: ["monday"],
        reminderIntervalMinutes: 5,
        medQuantities: [],
      },
    ]);
  });

  it("hides an archived intake", () => {
    const database = createTestDatabase({ seed: false });
    database
      .insert(intakeTable)
      .values({
        hour: 7,
        minute: 0,
        days: ["monday"],
        reminderIntervalMinutes: 5,
        isArchived: true,
      })
      .run();

    expect(getAllIntakes(database)).toEqual([]);
  });
});
