import { sql } from "drizzle-orm";

import { medLogTable, medTable } from "@/shared/database/schema";
import { createTestDatabase } from "@/shared/database/testDatabase";
import { countRows } from "@/shared/database/testHelpers";

import { getAllMeds } from "@/features/pillbox/queries/getAllMeds";
import { getMedById } from "@/features/pillbox/queries/getMedById";
import { getStockByMedId } from "@/features/stocks/queries/getStockByMedId";
import { findMedId } from "@/features/stocks/queries/testStocks";
import { insertMedLog } from "@/features/today/queries/insertMedLog";
import { archiveMed } from "./archiveMed";

const NOW = new Date(2026, 10, 4, 15, 40);

describe("archiveMed", () => {
  it("archives a med without intake, deletes its stock and keeps its logs", () => {
    const database = createTestDatabase();
    const paracetamolId = findMedId(database, "Paracétamol", "500 mg");
    insertMedLog(database, paracetamolId, NOW);

    expect(archiveMed(database, paracetamolId, NOW)).toEqual({ status: "archived" });

    expect(getMedById(database, paracetamolId)).toBeUndefined();
    expect(getAllMeds(database).map(({ name }) => name)).not.toContain("Paracétamol");
    expect(getStockByMedId(database, paracetamolId)).toBeUndefined();
    expect(countRows(database, medLogTable)).toBe(1);
    expect(
      database.get(sql`
        SELECT ${medTable.archivedOn} AS archivedOn FROM ${medTable} WHERE ${medTable.id} = ${paracetamolId}
      `),
    ).toEqual({ archivedOn: "2026-11-04" });
  });

  it("refuses to archive a med of an active intake and returns the intakes", () => {
    const database = createTestDatabase();
    const magnesiumId = findMedId(database, "Magnésium", "300 mg");

    const result = archiveMed(database, magnesiumId, NOW);

    expect(result.status).toBe("inIntakes");
    expect(result.status === "inIntakes" && result.intakes.map(({ time }) => time)).toEqual([
      { hour: 8, minute: 20 },
      { hour: 12, minute: 20 },
      { hour: 20, minute: 20 },
    ]);
    expect(getMedById(database, magnesiumId)).toBeDefined();
    expect(getStockByMedId(database, magnesiumId)).toBeDefined();
  });
});
