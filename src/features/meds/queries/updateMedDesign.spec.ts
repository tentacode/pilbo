import { createTestDatabase } from "@/shared/database/testDatabase";

import { getMedById } from "@/features/pillbox/queries/getMedById";
import { findMedId } from "@/features/stocks/queries/testStocks";
import { updateMedDesign } from "./updateMedDesign";

describe("updateMedDesign", () => {
  it("updates only the design of the med", () => {
    const database = createTestDatabase();
    const lithiumId = findMedId(database, "Lithium", "250 mg");
    const design = { shape: "oval", size: "large", colors: ["#FFFFFF", "#F58FB8"] } as const;

    updateMedDesign(database, lithiumId, { ...design, colors: [...design.colors] });

    expect(getMedById(database, lithiumId)).toEqual({
      id: lithiumId,
      name: "Lithium",
      strength: "250 mg",
      detail: "Avec le repas",
      design: { shape: "oval", size: "large", colors: ["#FFFFFF", "#F58FB8"] },
    });
  });
});
