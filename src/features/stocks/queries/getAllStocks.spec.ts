import { createTestDatabase } from "@/shared/database/testDatabase";

import { getAllStocks } from "./getAllStocks";
import { saveStock } from "./saveStock";
import { findMedId } from "./testStocks";

describe("getAllStocks", () => {
  it("returns each stock with its med", () => {
    const database = createTestDatabase();
    const medId = findMedId(database, "Mélatonine", "1 mg");
    saveStock(database, { medId, quantity: -2, boxSize: 28, lowStockDays: 5 });

    const melatonin = getAllStocks(database).find(({ med }) => med.id === medId);

    expect(melatonin).toEqual({
      med: {
        id: medId,
        name: "Mélatonine",
        strength: "1 mg",
        detail: "",
        design: { shape: "syrup", colors: ["#F8C6DA", "#FFFFFF"], size: "medium" },
      },
      stock: { medId, quantity: -2, boxSize: 28, lowStockDays: 5 },
    });
  });

  it("returns nothing when no stock is followed", () => {
    expect(getAllStocks(createTestDatabase({ seed: false }))).toEqual([]);
  });
});
