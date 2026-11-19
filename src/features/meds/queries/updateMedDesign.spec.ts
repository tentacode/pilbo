import { createTestDatabase } from "@/shared/database/testDatabase";

import { getMedById } from "@/features/pillbox/queries/getMedById";
import { findMedId } from "@/features/stocks/queries/testStocks";
import { updateMedDesign } from "./updateMedDesign";

describe("updateMedDesign", () => {
  it("updates only the design of the med", () => {
    const database = createTestDatabase();
    const magnesiumId = findMedId(database, "Magnésium", "300 mg");
    const design = { shape: "oval", size: "large", colors: ["#FFFFFF", "#F58FB8"] } as const;

    updateMedDesign(database, magnesiumId, { ...design, colors: [...design.colors] });

    expect(getMedById(database, magnesiumId)).toEqual({
      id: magnesiumId,
      name: "Magnésium",
      strength: "300 mg",
      detail: "Avec le repas",
      design: { shape: "oval", size: "large", colors: ["#FFFFFF", "#F58FB8"] },
    });
  });
});
