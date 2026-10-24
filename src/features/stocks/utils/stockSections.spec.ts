import { type Intake, WEEKDAYS } from "@/domain/intake";
import type { Med } from "@/domain/med";
import type { MedStock } from "@/domain/stock";

import { computeStockItems, splitStockSections } from "./stockSections";

const MONDAY_MORNING = new Date(2026, 9, 19, 7, 0);

function createMed(id: string, isAsNeeded = false): Med {
  return {
    id,
    name: id,
    strength: "",
    detail: "",
    design: { shape: "round", colors: ["#D6C9F5", "#D6C9F5"], size: "medium" },
    isAsNeeded,
  };
}

function createMedStock(med: Med, quantity: number): MedStock {
  return { med, stock: { medId: med.id, quantity, boxSize: 30, lowStockDays: 7 } };
}

const scheduledMeds = ["Alpha", "Beta", "Gamma", "Delta"].map((id) => createMed(id));
const asNeededMed = createMed("Epsilon", true);
const dailyIntake: Intake = {
  id: "daily",
  time: { hour: 8, minute: 0 },
  days: [...WEEKDAYS],
  reminderIntervalMinutes: 10,
  medQuantities: scheduledMeds.map((med) => ({ med, quantity: 1 })),
};

describe("stock sections", () => {
  it("sorts by days left, the low stocks apart, the meds without schedule last", () => {
    const [alpha, beta, gamma, delta] = scheduledMeds;
    const medStocks = [
      createMedStock(asNeededMed, 4),
      createMedStock(alpha, 40),
      createMedStock(beta, 5),
      createMedStock(gamma, 20),
      createMedStock(delta, 3),
      createMedStock(createMed("Zeta", true), 0),
    ];

    const sections = splitStockSections(
      computeStockItems(medStocks, [dailyIntake], [], MONDAY_MORNING),
    );

    expect(sections.low.map(({ med }) => med.id)).toEqual(["Zeta", "Delta", "Beta"]);
    expect(sections.sufficient.map(({ med }) => med.id)).toEqual(["Gamma", "Alpha", "Epsilon"]);
  });
});
