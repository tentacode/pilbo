import { createTestDatabase } from "@/shared/database/testDatabase";

import { getStockByMedId } from "./getStockByMedId";
import { increaseStock } from "./increaseStock";
import { saveStock } from "./saveStock";
import { findMedId } from "./testStocks";

describe("increaseStock", () => {
  it("gives back pills to the stock", () => {
    const database = createTestDatabase();
    const medId = findMedId(database, "Prazépam", "25 mg");
    saveStock(database, { medId, quantity: -1, boxSize: 30, lowStockDays: 7 });

    increaseStock(database, medId, 1);

    expect(getStockByMedId(database, medId)?.stock.quantity).toBe(0);
  });

  it("does nothing when the med has no stock", () => {
    const database = createTestDatabase();
    const medId = findMedId(database, "Prazépam", "25 mg");

    increaseStock(database, medId, 1);

    expect(getStockByMedId(database, medId)).toBeUndefined();
  });
});
