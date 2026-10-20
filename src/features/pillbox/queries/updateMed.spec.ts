import { createTestDatabase } from "@/shared/database/testDatabase";

import { getAsNeededMeds } from "./getAsNeededMeds";
import { getMedById } from "./getMedById";
import { updateMed } from "./updateMed";

describe("updateMed", () => {
  it("updates the name, strength, detail and design, and keeps the as needed flag", () => {
    const database = createTestDatabase();
    const [prazepam] = getAsNeededMeds(database);

    updateMed(database, {
      id: prazepam.id,
      name: "Hydroxyzine",
      strength: "25 mg",
      detail: "",
      design: { shape: "oval", colors: ["#FFFFFF", "#FFFFFF"], size: "large" },
    });

    expect(getMedById(database, prazepam.id)).toEqual({
      id: prazepam.id,
      name: "Hydroxyzine",
      strength: "25 mg",
      detail: "",
      design: { shape: "oval", colors: ["#FFFFFF", "#FFFFFF"], size: "large" },
      isAsNeeded: true,
    });
  });
});
