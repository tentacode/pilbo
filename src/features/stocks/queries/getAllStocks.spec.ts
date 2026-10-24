import { createTestDatabase } from "@/shared/database/testDatabase";

import { getAllStocks } from "./getAllStocks";
import { saveStock } from "./saveStock";
import { findMedId } from "./testStocks";

describe("getAllStocks", () => {
  it("returns each stock with its med", () => {
    const database = createTestDatabase();
    const medId = findMedId(database, "Quviviq", "50 mg");
    saveStock(database, { medId, quantity: -2, boxSize: 28, lowStockDays: 5 });

    const quviviq = getAllStocks(database).find(({ med }) => med.id === medId);

    expect(quviviq).toEqual({
      med: {
        id: medId,
        name: "Quviviq",
        strength: "50 mg",
        detail: "",
        design: { shape: "softgel", colors: ["#F8C6DA", "#F8C6DA"], size: "medium" },
        isAsNeeded: false,
      },
      stock: { medId, quantity: -2, boxSize: 28, lowStockDays: 5 },
    });
  });

  it("returns nothing when no stock is followed", () => {
    expect(getAllStocks(createTestDatabase({ seed: false }))).toEqual([]);
  });
});
