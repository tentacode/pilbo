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
        design: {
          shape: "capsule",
          firstHalfColor: "#F58FB8",
          secondHalfColor: "#FFFFFF",
          size: "medium",
        },
        isAsNeeded: true,
      },
    ]);
  });

  it("returns nothing when the database is empty", () => {
    expect(getAsNeededMeds(createTestDatabase({ seed: false }))).toEqual([]);
  });
});
