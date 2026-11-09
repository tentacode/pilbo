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
      "beep",
    );

    expect(alerts).toEqual([
      {
        identifier: "low-stock-2026-10-22",
        date: new Date(2026, 9, 22, 9, 0),
        title: "Stock bas",
        body: "Lamictal 50 mg : pensez à le renouveler.",
        interruptionLevel: "active",
        sound: "beep",
        channelId: "low-stock",
      },
      {
        identifier: "low-stock-2026-10-25",
        date: new Date(2026, 9, 25, 9, 0),
        title: "Stock bas",
        body: "Lamictal 100 mg, Lithium 250 mg : pensez à les renouveler.",
        interruptionLevel: "active",
        sound: "beep",
        channelId: "low-stock",
      },
    ]);
  });

  it("plans the alert of today before 9 a.m. only", () => {
    const stockItems = [createStockItem("Lithium", "250 mg", new Date(2026, 9, 19))];

    expect(planLowStockAlerts(stockItems, MONDAY_MORNING, "beep")).toHaveLength(1);
    expect(planLowStockAlerts(stockItems, new Date(2026, 9, 19, 9, 0), "beep")).toEqual([]);
  });

  it("plans nothing for a past crossing day or without crossing day", () => {
    expect(
      planLowStockAlerts(
        [
          createStockItem("Lithium", "250 mg", new Date(2026, 9, 12)),
          createStockItem("Prazépam", "25 mg"),
        ],
        MONDAY_MORNING,
        "beep",
      ),
    ).toEqual([]);
  });

  it("uses the low stock sound and its channel", () => {
    const [alert] = planLowStockAlerts(
      [createStockItem("Lithium", "250 mg", new Date(2026, 9, 22))],
      MONDAY_MORNING,
      "vibration",
    );

    expect(alert).toMatchObject({ sound: "vibration", channelId: "low-stock-vibration" });
  });
});
