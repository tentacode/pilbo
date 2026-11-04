import { createTestDatabase } from "@/shared/database/testDatabase";

import { findMedId } from "@/features/stocks/queries/testStocks";
import { getActiveIntakesOfMed } from "./getActiveIntakesOfMed";

describe("getActiveIntakesOfMed", () => {
  it("returns the active intakes containing the med, with all their meds", () => {
    const database = createTestDatabase();

    const intakes = getActiveIntakesOfMed(database, findMedId(database, "Lamictal", "50 mg"));

    expect(intakes).toHaveLength(1);
    expect(intakes[0].time).toEqual({ hour: 8, minute: 20 });
    expect(intakes[0].medQuantities.map(({ med }) => med.name).sort()).toEqual([
      "Lamictal",
      "Lithium",
    ]);
  });

  it("ignores the archived versions of an intake", () => {
    const database = createTestDatabase({ withLogs: true, now: new Date(2026, 9, 24) });

    const times = getActiveIntakesOfMed(database, findMedId(database, "Lithium", "250 mg")).map(
      ({ time }) => time,
    );

    expect(times).toEqual([
      { hour: 8, minute: 20 },
      { hour: 12, minute: 20 },
      { hour: 20, minute: 20 },
    ]);
  });

  it("returns nothing for a med without intake", () => {
    const database = createTestDatabase();

    expect(getActiveIntakesOfMed(database, findMedId(database, "Prazépam", "25 mg"))).toEqual([]);
  });
});
