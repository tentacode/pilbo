import { createTestDatabase } from "@/shared/database/testDatabase";

import { getAllMeds } from "@/features/pillbox/queries/getAllMeds";
import { deleteStock } from "./deleteStock";
import { getStockByMedId } from "./getStockByMedId";
import { saveStock } from "./saveStock";
import { findMedId } from "./testStocks";

describe("deleteStock", () => {
  it("deletes the stock and keeps the med", () => {
    const database = createTestDatabase();
    const medId = findMedId(database, "Quviviq", "50 mg");
    saveStock(database, { medId, quantity: 30, boxSize: 30, lowStockDays: 7 });

    deleteStock(database, medId);

    expect(getStockByMedId(database, medId)).toBeUndefined();
    expect(getAllMeds(database).map(({ id }) => id)).toContain(medId);
  });
});
