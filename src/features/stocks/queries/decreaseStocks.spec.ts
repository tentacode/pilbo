import { createTestDatabase } from "@/shared/database/testDatabase";
import type { Database } from "@/shared/database/types";

import { decreaseStocks } from "./decreaseStocks";
import { getStockByMedId } from "./getStockByMedId";
import { saveStock } from "./saveStock";
import { findMedId } from "./testStocks";

function quantityOf(database: Database, medId: string): number | undefined {
  return getStockByMedId(database, medId)?.stock.quantity;
}

describe("decreaseStocks", () => {
  it("decreases the stocks and ignores the meds without stock", () => {
    const database = createTestDatabase();
    const melatoninId = findMedId(database, "Mélatonine", "1 mg");
    const ironId = findMedId(database, "Fer", "80 mg");
    saveStock(database, { medId: melatoninId, quantity: 10, boxSize: 30, lowStockDays: 7 });

    const medIdsBelowZero = decreaseStocks(database, [
      { medId: melatoninId, quantity: 2 },
      { medId: ironId, quantity: 1 },
    ]);

    expect(quantityOf(database, melatoninId)).toBe(8);
    expect(quantityOf(database, ironId)).toBeUndefined();
    expect(medIdsBelowZero).toEqual([]);
  });

  it("returns the meds going below zero", () => {
    const database = createTestDatabase();
    const melatoninId = findMedId(database, "Mélatonine", "1 mg");
    const ironId = findMedId(database, "Fer", "80 mg");
    saveStock(database, { medId: melatoninId, quantity: 0, boxSize: 30, lowStockDays: 7 });
    saveStock(database, { medId: ironId, quantity: 2, boxSize: 30, lowStockDays: 7 });

    const medIdsBelowZero = decreaseStocks(database, [
      { medId: melatoninId, quantity: 1 },
      { medId: ironId, quantity: 2 },
    ]);

    expect(quantityOf(database, melatoninId)).toBe(-1);
    expect(quantityOf(database, ironId)).toBe(0);
    expect(medIdsBelowZero).toEqual([melatoninId]);
  });

  it("does not return a stock already below zero", () => {
    const database = createTestDatabase();
    const medId = findMedId(database, "Mélatonine", "1 mg");
    saveStock(database, { medId, quantity: -1, boxSize: 30, lowStockDays: 7 });

    expect(decreaseStocks(database, [{ medId, quantity: 1 }])).toEqual([]);
    expect(quantityOf(database, medId)).toBe(-2);
  });

  it("works inside a transaction", () => {
    const database = createTestDatabase();
    const medId = findMedId(database, "Mélatonine", "1 mg");
    saveStock(database, { medId, quantity: 1, boxSize: 30, lowStockDays: 7 });

    const medIdsBelowZero = database.transaction((transaction) =>
      decreaseStocks(transaction, [{ medId, quantity: 3 }]),
    );

    expect(medIdsBelowZero).toEqual([medId]);
    expect(quantityOf(database, medId)).toBe(-2);
  });
});
