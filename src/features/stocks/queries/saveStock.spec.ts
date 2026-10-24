import { sql } from "drizzle-orm";

import { medTable, stockTable } from "@/shared/database/schema";
import { createTestDatabase } from "@/shared/database/testDatabase";
import { countRows } from "@/shared/database/testHelpers";

import { getStockByMedId } from "./getStockByMedId";
import { saveStock } from "./saveStock";
import { findMedId } from "./testStocks";

describe("saveStock", () => {
  it("creates the stock of a med", () => {
    const database = createTestDatabase();
    const medId = findMedId(database, "Quviviq", "50 mg");

    saveStock(database, { medId, quantity: 30, boxSize: 30, lowStockDays: 7 });

    expect(getStockByMedId(database, medId)?.stock.quantity).toBe(30);
  });

  it("updates an existing stock", () => {
    const database = createTestDatabase();
    const medId = findMedId(database, "Quviviq", "50 mg");
    saveStock(database, { medId, quantity: 30, boxSize: 30, lowStockDays: 7 });
    const rowCount = countRows(database, stockTable);

    saveStock(database, { medId, quantity: 4, boxSize: 28, lowStockDays: 10 });

    expect(getStockByMedId(database, medId)?.stock).toEqual({
      medId,
      quantity: 4,
      boxSize: 28,
      lowStockDays: 10,
    });
    expect(countRows(database, stockTable)).toBe(rowCount);
  });

  it("deletes the stock with its med", () => {
    const database = createTestDatabase();
    const medId = findMedId(database, "Prazépam", "25 mg");
    saveStock(database, { medId, quantity: 30, boxSize: 30, lowStockDays: 7 });

    database
      .delete(medTable)
      .where(sql`${medTable.id} = ${medId}`)
      .run();

    expect(getStockByMedId(database, medId)).toBeUndefined();
  });
});
