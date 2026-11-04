import { createTestDatabase } from "@/shared/database/testDatabase";

import { findMedId } from "@/features/stocks/queries/testStocks";
import { getMedById } from "./getMedById";
import { updateMed } from "./updateMed";

describe("updateMed", () => {
  it("updates the name, strength, detail and design", () => {
    const database = createTestDatabase();
    const prazepam = { id: findMedId(database, "Prazépam", "25 mg") };

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
    });
  });
});
