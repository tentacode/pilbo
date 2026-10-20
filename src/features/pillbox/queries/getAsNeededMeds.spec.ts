import { createTestDatabase } from "@/shared/database/testDatabase";

import { getAsNeededMeds } from "./getAsNeededMeds";

describe("getAsNeededMeds", () => {
  it("returns only the as needed meds", () => {
    const meds = getAsNeededMeds(createTestDatabase());

    expect(meds).toEqual([
      {
        id: expect.any(String),
        name: "Prazépam",
        strength: "25 mg",
        detail: "Si besoin",
        design: { shape: "capsule", colors: ["#F58FB8", "#FFFFFF"], size: "medium" },
        isAsNeeded: true,
      },
    ]);
  });

  it("returns nothing when the database is empty", () => {
    expect(getAsNeededMeds(createTestDatabase({ seed: false }))).toEqual([]);
  });
});
