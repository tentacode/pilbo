import { WEEKDAYS } from "@/domain/intake";
import type { NotificationSound } from "@/domain/sound";
import { intakeTable } from "@/shared/database/schema";
import { createTestDatabase } from "@/shared/database/testDatabase";

import { getAllIntakes } from "./getAllIntakes";

describe("getAllIntakes", () => {
  it("returns the intakes ordered by time", () => {
    const intakes = getAllIntakes(createTestDatabase());

    expect(intakes.map(({ time }) => time)).toEqual([
      { hour: 8, minute: 20 },
      { hour: 9, minute: 0 },
      { hour: 12, minute: 20 },
      { hour: 19, minute: 30 },
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
        ["Magnésium", "300 mg", 1],
        ["Vitamine D", "400 UI", 1],
      ]),
    );
    expect(morning.medQuantities[0].med.design.shape).toEqual(expect.any(String));
    expect(morning.medQuantities.map(({ med }) => [med.name, med.detail])).toEqual(
      expect.arrayContaining([
        ["Magnésium", "Avec le repas"],
        ["Vitamine D", ""],
      ]),
    );
  });

  it("returns an intake without meds", () => {
    const database = createTestDatabase({ seed: false });
    database
      .insert(intakeTable)
      .values({
        hour: 7,
        minute: 0,
        days: ["monday"],
        reminderIntervalMinutes: 5,
        createdOn: "2026-10-01",
        startsOn: "2026-10-01",
      })
      .run();

    expect(getAllIntakes(database)).toEqual([
      {
        id: expect.any(String),
        time: { hour: 7, minute: 0 },
        days: ["monday"],
        frequency: "daily",
        interval: 1,
        startsOn: "2026-10-01",
        reminderIntervalMinutes: 5,
        sound: "beep",
        medQuantities: [],
      },
    ]);
  });

  it("reads the recurrence of each intake", () => {
    const database = createTestDatabase({ seed: false });
    database
      .insert(intakeTable)
      .values({
        hour: 7,
        minute: 0,
        days: ["tuesday"],
        frequency: "weekly",
        interval: 3,
        startsOn: "2026-11-03",
        reminderIntervalMinutes: 5,
        createdOn: "2026-10-01",
      })
      .run();

    expect(getAllIntakes(database)[0]).toEqual(
      expect.objectContaining({
        days: ["tuesday"],
        frequency: "weekly",
        interval: 3,
        startsOn: "2026-11-03",
      }),
    );
  });

  it("reads the sound of each intake", () => {
    const intakes = getAllIntakes(createTestDatabase());

    expect(intakes.map(({ sound }) => sound)).toEqual([
      "beep",
      "beep",
      "beep",
      "beep",
      "beep",
      "nocturne",
    ]);
  });

  it("falls back to the default sound for an unknown sound", () => {
    const database = createTestDatabase({ seed: false });
    database
      .insert(intakeTable)
      .values({
        hour: 7,
        minute: 0,
        days: ["monday"],
        reminderIntervalMinutes: 5,
        sound: "removed_sound" as NotificationSound,
        createdOn: "2026-10-01",
        startsOn: "2026-10-01",
      })
      .run();

    expect(getAllIntakes(database)[0].sound).toBe("beep");
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
        createdOn: "2026-10-01",
        startsOn: "2026-10-01",
        archivedOn: "2026-10-20",
      })
      .run();

    expect(getAllIntakes(database)).toEqual([]);
  });
});
