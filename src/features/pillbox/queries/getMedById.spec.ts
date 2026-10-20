import { medTable } from "@/shared/database/schema";
import { createTestDatabase } from "@/shared/database/testDatabase";

import { getAsNeededMeds } from "./getAsNeededMeds";
import { getMedById } from "./getMedById";

describe("getMedById", () => {
  it("returns the med", () => {
    const database = createTestDatabase();
    const [prazepam] = getAsNeededMeds(database);

    expect(getMedById(database, prazepam.id)).toEqual(prazepam);
  });

  it("reads a single color design as a plain two color design", () => {
    const database = createTestDatabase({ seed: false });
    const { id } = database
      .insert(medTable)
      .values({
        name: "Lithium",
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
});
