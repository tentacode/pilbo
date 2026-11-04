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
    const prazepamId = findMedId(database, "Prazépam", "25 mg");
    insertMedLog(database, prazepamId, NOW);

    expect(archiveMed(database, prazepamId, NOW)).toEqual({ status: "archived" });

    expect(getMedById(database, prazepamId)).toBeUndefined();
    expect(getAllMeds(database).map(({ name }) => name)).not.toContain("Prazépam");
    expect(getStockByMedId(database, prazepamId)).toBeUndefined();
    expect(countRows(database, medLogTable)).toBe(1);
    expect(
      database.get(sql`
        SELECT ${medTable.archivedOn} AS archivedOn FROM ${medTable} WHERE ${medTable.id} = ${prazepamId}
      `),
    ).toEqual({ archivedOn: "2026-11-04" });
  });

  it("refuses to archive a med of an active intake and returns the intakes", () => {
    const database = createTestDatabase();
    const lithiumId = findMedId(database, "Lithium", "250 mg");

    const result = archiveMed(database, lithiumId, NOW);

    expect(result.status).toBe("inIntakes");
    expect(result.status === "inIntakes" && result.intakes.map(({ time }) => time)).toEqual([
      { hour: 8, minute: 20 },
      { hour: 12, minute: 20 },
      { hour: 20, minute: 20 },
    ]);
    expect(getMedById(database, lithiumId)).toBeDefined();
    expect(getStockByMedId(database, lithiumId)).toBeDefined();
  });
});
