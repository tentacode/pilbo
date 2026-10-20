import { createTestDatabase } from "@/shared/database/testDatabase";

import { findDuplicateMed } from "./findDuplicateMed";
import { getAllMeds } from "./getAllMeds";
import { insertMed } from "./insertMed";

describe("findDuplicateMed", () => {
  it("finds a med with the same name and strength, ignoring the surrounding spaces", () => {
    const duplicate = findDuplicateMed(createTestDatabase(), {
      name: "  Lithium ",
      strength: "250 mg ",
    });

    expect(duplicate?.name).toBe("Lithium");
  });

  it("compares the case and the accents exactly", () => {
    const database = createTestDatabase();

    expect(findDuplicateMed(database, { name: "lithium", strength: "250 mg" })).toBeUndefined();
    expect(findDuplicateMed(database, { name: "Prazepam", strength: "25 mg" })).toBeUndefined();
  });

  it("does not match another strength", () => {
    expect(
      findDuplicateMed(createTestDatabase(), { name: "Lithium", strength: "400 mg" }),
    ).toBeUndefined();
  });

  it("matches two meds without strength", () => {
    const database = createTestDatabase();
    insertMed(database, {
      name: "Doliprane",
      strength: "",
      detail: "",
      design: { shape: "round", colors: ["#FFFFFF", "#FFFFFF"], size: "medium" },
      isAsNeeded: true,
    });

    expect(findDuplicateMed(database, { name: "Doliprane", strength: "" })?.name).toBe("Doliprane");
  });

  it("ignores the edited med itself", () => {
    const database = createTestDatabase();
    const lithium = getAllMeds(database).find(({ name }) => name === "Lithium");

    expect(
      findDuplicateMed(database, {
        name: "Lithium",
        strength: "250 mg",
        excludedMedId: lithium?.id,
      }),
    ).toBeUndefined();
  });
});
