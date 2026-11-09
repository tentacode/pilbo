import { type Intake, WEEKDAYS } from "@/domain/intake";
import type { Med } from "@/domain/med";
import type { MedStock } from "@/domain/stock";

import { computeStockItems } from "./stockItems";

const MONDAY_MORNING = new Date(2026, 9, 19, 7, 0);

function createMed(id: string): Med {
  return {
    id,
    name: id,
    strength: "",
    detail: "",
    design: { shape: "round", colors: ["#D6C9F5", "#D6C9F5"], size: "medium" },
  };
}

function createMedStock(med: Med, quantity: number): MedStock {
  return { med, stock: { medId: med.id, quantity, boxSize: 30, lowStockDays: 7 } };
}

describe("computeStockItems", () => {
  it("computes the forecast of each stock", () => {
    const scheduled = createMed("Alpha");
    const unscheduled = createMed("Beta");
    const dailyIntake: Intake = {
      id: "daily",
      time: { hour: 8, minute: 0 },
      days: [...WEEKDAYS],
      reminderIntervalMinutes: 10,
      sound: "beep",
      medQuantities: [{ med: scheduled, quantity: 1 }],
    };

    const stockItems = computeStockItems(
      [createMedStock(scheduled, 5), createMedStock(unscheduled, 4)],
      [dailyIntake],
      [],
      MONDAY_MORNING,
    );

    expect(
      stockItems.map(({ med, forecast }) => [med.id, forecast.status, forecast.daysLeft]),
    ).toEqual([
      ["Alpha", "low", 5],
      ["Beta", "noSchedule", undefined],
    ]);
  });
});
