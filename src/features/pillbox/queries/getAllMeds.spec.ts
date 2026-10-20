import { createTestDatabase } from "@/shared/database/testDatabase";

import { getAllMeds } from "./getAllMeds";

describe("getAllMeds", () => {
  it("returns every med, scheduled or as needed", () => {
    const meds = getAllMeds(createTestDatabase());

    expect(meds).toHaveLength(6);
    expect(meds.find(({ name }) => name === "Lithium")).toEqual({
      id: expect.any(String),
      name: "Lithium",
      strength: "250 mg",
      detail: "Avec le repas",
      design: { shape: "round", colors: ["#D6C9F5", "#D6C9F5"], size: "medium" },
      isAsNeeded: false,
    });
    expect(meds.find(({ name }) => name === "Prazépam")?.isAsNeeded).toBe(true);
  });

  it("returns nothing when the database is empty", () => {
    expect(getAllMeds(createTestDatabase({ seed: false }))).toEqual([]);
  });
});
