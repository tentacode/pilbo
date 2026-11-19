import { sql } from "drizzle-orm";

import { medTable } from "@/shared/database/schema";
import { createTestDatabase } from "@/shared/database/testDatabase";

import { findMedId } from "@/features/stocks/queries/testStocks";
import { getAllMeds } from "./getAllMeds";
import { getMedById } from "./getMedById";

describe("getMedById", () => {
  it("returns the med", () => {
    const database = createTestDatabase();
    const paracetamol = getAllMeds(database).find(({ name }) => name === "Paracétamol");

    expect(getMedById(database, paracetamol?.id ?? "")).toEqual(paracetamol);
  });

  it("reads a single color design as a plain two color design", () => {
    const database = createTestDatabase({ seed: false });
    const { id } = database
      .insert(medTable)
      .values({
        name: "Magnésium",
        strength: "",
        design: JSON.parse('{"shape":"round","size":"medium","colors":["#D6C9F5"]}'),
      })
      .returning({ id: medTable.id })
      .get();

    expect(getMedById(database, id)?.design.colors).toEqual(["#D6C9F5", "#D6C9F5"]);
  });

  it("returns undefined for an unknown med", () => {
    expect(getMedById(createTestDatabase(), "unknown")).toBeUndefined();
  });

  it("returns undefined for an archived med", () => {
    const database = createTestDatabase();
    const paracetamolId = findMedId(database, "Paracétamol", "500 mg");
    database
      .update(medTable)
      .set({ archivedOn: "2026-11-04" })
      .where(sql`${medTable.id} = ${paracetamolId}`)
      .run();

    expect(getMedById(database, paracetamolId)).toBeUndefined();
  });
});
