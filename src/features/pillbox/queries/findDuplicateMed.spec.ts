import { createTestDatabase } from "@/shared/database/testDatabase";

import { findDuplicateMed } from "./findDuplicateMed";
import { getAllMeds } from "./getAllMeds";
import { insertMed } from "./insertMed";
import { archiveMed } from "@/features/meds/queries/archiveMed";
import { findMedId } from "@/features/stocks/queries/testStocks";

describe("findDuplicateMed", () => {
  it("finds a med with the same name and strength, ignoring the surrounding spaces", () => {
    const duplicate = findDuplicateMed(createTestDatabase(), {
      name: "  Magnésium ",
      strength: "300 mg ",
    });

    expect(duplicate?.name).toBe("Magnésium");
  });

  it("compares the case and the accents exactly", () => {
    const database = createTestDatabase();

    expect(findDuplicateMed(database, { name: "magnésium", strength: "300 mg" })).toBeUndefined();
    expect(findDuplicateMed(database, { name: "Paracetamol", strength: "500 mg" })).toBeUndefined();
  });

  it("does not match another strength", () => {
    expect(
      findDuplicateMed(createTestDatabase(), { name: "Magnésium", strength: "400 mg" }),
    ).toBeUndefined();
  });

  it("matches two meds without strength", () => {
    const database = createTestDatabase();
    insertMed(database, {
      name: "Doliprane",
      strength: "",
      detail: "",
      design: { shape: "round", colors: ["#FFFFFF", "#FFFFFF"], size: "medium" },
    });

    expect(findDuplicateMed(database, { name: "Doliprane", strength: "" })?.name).toBe("Doliprane");
  });

  it("ignores the edited med itself", () => {
    const database = createTestDatabase();
    const magnesium = getAllMeds(database).find(({ name }) => name === "Magnésium");

    expect(
      findDuplicateMed(database, {
        name: "Magnésium",
        strength: "300 mg",
        excludedMedId: magnesium?.id,
      }),
    ).toBeUndefined();
  });

  it("ignores the archived meds", () => {
    const database = createTestDatabase();
    archiveMed(database, findMedId(database, "Paracétamol", "500 mg"), new Date(2026, 10, 4));

    expect(findDuplicateMed(database, { name: "Paracétamol", strength: "500 mg" })).toBeUndefined();
  });
});
