import { createTestDatabase } from "@/shared/database/testDatabase";

import { getAllIntakes } from "./getAllIntakes";
import { getAllMeds } from "./getAllMeds";
import { getAsNeededMeds } from "./getAsNeededMeds";
import { setMedAsNeeded } from "./setMedAsNeeded";

function findLithium(meds: { id: string; name: string }[]) {
  return meds.find(({ name }) => name === "Lithium");
}

describe("setMedAsNeeded", () => {
  it("adds a scheduled med to the as needed meds and keeps it in its intakes", () => {
    const database = createTestDatabase();
    const lithium = findLithium(getAllMeds(database));

    setMedAsNeeded(database, lithium?.id ?? "", true);

    expect(findLithium(getAsNeededMeds(database))).toBeDefined();
    expect(getAllIntakes(database)[0].medQuantities.map(({ med }) => med.name)).toContain(
      "Lithium",
    );
  });

  it("removes a med from the as needed meds", () => {
    const database = createTestDatabase();
    const [prazepam] = getAsNeededMeds(database);

    setMedAsNeeded(database, prazepam.id, false);

    expect(getAsNeededMeds(database)).toEqual([]);
    expect(getAllMeds(database)).toHaveLength(6);
  });
});
