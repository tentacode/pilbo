import { createTestDatabase } from "@/shared/database/testDatabase";

import { getStockByMedId } from "./getStockByMedId";
import { saveStock } from "./saveStock";
import { findMedId } from "./testStocks";

describe("getStockByMedId", () => {
  it("returns the stock of the med", () => {
    const database = createTestDatabase();
    const medId = findMedId(database, "Mélatonine", "1 mg");
    saveStock(database, { medId, quantity: 12, boxSize: 28, lowStockDays: 5 });

    const medStock = getStockByMedId(database, medId);

    expect(medStock?.med.name).toBe("Mélatonine");
    expect(medStock?.stock).toEqual({ medId, quantity: 12, boxSize: 28, lowStockDays: 5 });
  });

  it("returns undefined when the med has no stock", () => {
    const database = createTestDatabase();

    expect(getStockByMedId(database, findMedId(database, "Mélatonine", "1 mg"))).toBeUndefined();
  });
});
