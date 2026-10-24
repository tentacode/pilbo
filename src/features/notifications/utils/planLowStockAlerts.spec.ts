import type { Med } from "@/domain/med";

import type { StockForecast } from "@/features/stocks/utils/stockForecast";
import type { StockItem } from "@/features/stocks/utils/stockTypes";
import { planLowStockAlerts } from "./planLowStockAlerts";

function createStockItem(name: string, strength: string, lowStockDate?: Date): StockItem {
  const med: Med = {
    id: `${name}-${strength}`,
    name,
    strength,
    detail: "",
    design: { shape: "round", colors: ["#D6C9F5", "#D6C9F5"], size: "medium" },
    isAsNeeded: false,
  };
  const forecast: StockForecast = { status: "sufficient", daysLeft: 20, lowStockDate };
  return { med, stock: { medId: med.id, quantity: 20, boxSize: 30, lowStockDays: 7 }, forecast };
}

const MONDAY_MORNING = new Date(2026, 9, 19, 7, 0);

describe("planLowStockAlerts", () => {
  it("plans one alert at 9 a.m. per crossing day, listing its meds", () => {
    const alerts = planLowStockAlerts(
      [
        createStockItem("Lithium", "250 mg", new Date(2026, 9, 25)),
        createStockItem("Lamictal", "50 mg", new Date(2026, 9, 22)),
        createStockItem("Lamictal", "100 mg", new Date(2026, 9, 25)),
      ],
      MONDAY_MORNING,
    );

    expect(alerts).toEqual([
      {
        identifier: "low-stock-2026-10-22",
        date: new Date(2026, 9, 22, 9, 0),
        title: "Stock bas",
        body: "Lamictal 50 mg : pensez à le renouveler.",
      },
      {
        identifier: "low-stock-2026-10-25",
        date: new Date(2026, 9, 25, 9, 0),
        title: "Stock bas",
        body: "Lamictal 100 mg, Lithium 250 mg : pensez à les renouveler.",
      },
    ]);
  });

  it("plans the alert of today before 9 a.m. only", () => {
    const stockItems = [createStockItem("Lithium", "250 mg", new Date(2026, 9, 19))];

    expect(planLowStockAlerts(stockItems, MONDAY_MORNING)).toHaveLength(1);
    expect(planLowStockAlerts(stockItems, new Date(2026, 9, 19, 9, 0))).toEqual([]);
  });

  it("plans nothing for a past crossing day or without crossing day", () => {
    expect(
      planLowStockAlerts(
        [
          createStockItem("Lithium", "250 mg", new Date(2026, 9, 12)),
          createStockItem("Prazépam", "25 mg"),
        ],
        MONDAY_MORNING,
      ),
    ).toEqual([]);
  });
});
