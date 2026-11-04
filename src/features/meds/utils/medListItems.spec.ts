import { type Intake, WEEKDAYS } from "@/domain/intake";
import type { Med } from "@/domain/med";

import { computeMedListItems } from "./medListItems";

const MONDAY_MORNING = new Date(2026, 9, 19, 7, 0);

function createMed(id: string, name: string, strength = ""): Med {
  return {
    id,
    name,
    strength,
    detail: "",
    design: { shape: "round", colors: ["#D6C9F5", "#D6C9F5"], size: "medium" },
  };
}

describe("computeMedListItems", () => {
  it("sorts the meds alphabetically and computes the forecast of their stock", () => {
    const lithium = createMed("lithium", "Lithium", "250 mg");
    const doliprane = createMed("doliprane", "Doliprane", "500 mg");
    const lamictal = createMed("lamictal", "Lamictal", "100 mg");
    const dailyIntake: Intake = {
      id: "daily",
      time: { hour: 8, minute: 0 },
      days: [...WEEKDAYS],
      reminderIntervalMinutes: 10,
      medQuantities: [{ med: lithium, quantity: 1 }],
    };

    const items = computeMedListItems(
      [lithium, doliprane, lamictal],
      [
        { med: lithium, stock: { medId: "lithium", quantity: 28, boxSize: 30, lowStockDays: 7 } },
        {
          med: doliprane,
          stock: { medId: "doliprane", quantity: 12, boxSize: 16, lowStockDays: 7 },
        },
      ],
      [dailyIntake],
      [],
      MONDAY_MORNING,
    );

    expect(
      items.map(({ med, stockStatus }) => [
        med.name,
        stockStatus?.forecast.status,
        stockStatus?.forecast.daysLeft,
      ]),
    ).toEqual([
      ["Doliprane", "noSchedule", undefined],
      ["Lamictal", undefined, undefined],
      ["Lithium", "sufficient", 28],
    ]);
  });
});
