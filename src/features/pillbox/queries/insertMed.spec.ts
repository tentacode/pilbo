import { medTable } from "@/shared/database/schema";
import { createTestDatabase } from "@/shared/database/testDatabase";
import { countRows } from "@/shared/database/testHelpers";

import { getMedById } from "./getMedById";
import { insertMed } from "./insertMed";

describe("insertMed", () => {
  it("inserts the med and returns it with its identifier", () => {
    const database = createTestDatabase({ seed: false });

    const med = insertMed(database, {
      name: "Mélatonine",
      strength: "",
      detail: "Au coucher",
      design: { shape: "softgel", colors: ["#F8C6DA", "#F8C6DA"], size: "small" },
      isAsNeeded: true,
    });

    expect(getMedById(database, med.id)).toEqual(med);
    expect(countRows(database, medTable)).toBe(1);
  });
});
