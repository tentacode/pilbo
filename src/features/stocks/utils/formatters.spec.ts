import { type Intake, WEEKDAYS } from "@/domain/intake";
import type { Med } from "@/domain/med";
import { formatDayAndMonth } from "@/shared/i18n/formatters";
import { i18n } from "@/shared/i18n/i18n";

import {
  formatCoverage,
  formatDayCount,
  formatDaysLeft,
  formatLowStockMention,
  formatLowStockNotice,
  formatMedSchedule,
  formatPillCount,
  formatStockCardAccessibilityLabel,
  formatStocksBelowZeroMessage,
  formatThresholdHelp,
} from "./formatters";
import type { StockForecast } from "./stockForecast";
import type { StockItem } from "./stockTypes";

const t = i18n.getFixedT(null, "stocks");

const lithium: Med = {
  id: "lithium",
  name: "Lithium",
  strength: "250 mg",
  detail: "",
  design: { shape: "round", colors: ["#D6C9F5", "#D6C9F5"], size: "medium" },
  isAsNeeded: false,
};

function createStockItem(quantity: number, forecast: StockForecast, med = lithium): StockItem {
  return { med, stock: { medId: med.id, quantity, boxSize: 30, lowStockDays: 7 }, forecast };
}

const lowItem = createStockItem(5, {
  status: "low",
  daysLeft: 5,
  lastCoveredDate: new Date(2026, 9, 9),
  lowStockDate: new Date(2026, 9, 2),
});
const sufficientItem = createStockItem(84, {
  status: "sufficient",
  daysLeft: 28,
  lastCoveredDate: new Date(2026, 10, 1),
  lowStockDate: new Date(2026, 9, 25),
});
const emptyItem = createStockItem(-1, {
  status: "low",
  daysLeft: 0,
  lastCoveredDate: new Date(2026, 9, 18),
});

describe("stock formatters", () => {
  it("pluralizes the pills and the days", () => {
    expect(formatPillCount(t, 0)).toBe("0 comprimé");
    expect(formatPillCount(t, 1)).toBe("1 comprimé");
    expect(formatPillCount(t, 84)).toBe("84 comprimés");
    expect(formatPillCount(t, -2)).toBe("-2 comprimés");
    expect(formatDayCount(t, 1)).toBe("1 jour");
    expect(formatDayCount(t, 28)).toBe("28 jours");
  });

  it("formats the day and the month", () => {
    expect(formatDayAndMonth(new Date(2026, 9, 9), "fr")).toBe("9 octobre");
    expect(formatDayAndMonth(new Date(2026, 10, 1), "fr")).toBe("1er novembre");
  });

  it("formats the days left", () => {
    expect(formatDaysLeft(t, sufficientItem)).toEqual({ kind: "days", count: 28, unit: "jours" });
    expect(formatDaysLeft(t, emptyItem)).toEqual({ kind: "days", count: 0, unit: "jour" });
    expect(formatDaysLeft(t, createStockItem(4, { status: "noSchedule" }))).toEqual({
      kind: "text",
      text: "Aucune prise prévue",
    });
    expect(
      formatDaysLeft(
        t,
        createStockItem(4, { status: "noSchedule" }, { ...lithium, isAsNeeded: true }),
      ),
    ).toEqual({ kind: "text", text: "Si besoin" });
  });

  it("formats the low stock mention", () => {
    expect(formatLowStockMention(t, "fr", lowItem)).toBe("Stock bas · jusqu’au 9 octobre");
    expect(formatLowStockMention(t, "fr", emptyItem)).toBe("Stock bas · à renouveler");
    expect(formatLowStockMention(t, "fr", createStockItem(0, { status: "low" }))).toBe(
      "Stock bas · à renouveler",
    );
  });

  it("formats the card accessibility label", () => {
    expect(formatStockCardAccessibilityLabel(t, "fr", sufficientItem)).toBe(
      "Lithium 250 mg, 84 comprimés, 28 jours, Stock suffisant",
    );
    expect(formatStockCardAccessibilityLabel(t, "fr", lowItem)).toBe(
      "Lithium 250 mg, 5 comprimés, 5 jours, Stock bas jusqu’au 9 octobre",
    );
  });
});

describe("stock edit formatters", () => {
  const morning: Intake = {
    id: "morning",
    time: { hour: 8, minute: 30 },
    days: [...WEEKDAYS],
    reminderIntervalMinutes: 10,
    medQuantities: [{ med: lithium, quantity: 2 }],
  };
  const evening: Intake = { ...morning, id: "evening", time: { hour: 20, minute: 30 } };

  it("adds the daily pills only when they are the same every day", () => {
    expect(formatMedSchedule(t, lithium, [evening, morning])).toBe(
      "4 comprimés par jour · 08:30 et 20:30",
    );
    expect(formatMedSchedule(t, lithium, [{ ...morning, days: ["monday"] }, evening])).toBe(
      "Prises de 08:30 et 20:30",
    );
    expect(
      formatMedSchedule(t, lithium, [
        morning,
        { ...morning, id: "noon", time: { hour: 12, minute: 0 }, days: ["monday"] },
        evening,
      ]),
    ).toBe("Prises de 08:30, 12:00 et 20:30");
    expect(
      formatMedSchedule(t, lithium, [
        { ...morning, days: ["monday"], medQuantities: [{ med: lithium, quantity: 1 }] },
      ]),
    ).toBe("1 comprimé par jour · 08:30");
  });

  it("describes a med without schedule", () => {
    expect(formatMedSchedule(t, lithium, [])).toBe("Aucune prise prévue");
    expect(formatMedSchedule(t, { ...lithium, isAsNeeded: true }, [])).toBe("Si besoin");
  });

  it("formats the coverage", () => {
    expect(formatCoverage(t, "fr", lithium, sufficientItem.forecast)).toEqual({
      emphasis: "28 jours",
      rest: ", jusqu’au 1er novembre",
    });
    expect(formatCoverage(t, "fr", lithium, emptyItem.forecast)).toEqual({
      emphasis: "0 jour",
      rest: ", à renouveler",
    });
    expect(formatCoverage(t, "fr", { isAsNeeded: true }, { status: "noSchedule" })).toEqual({
      emphasis: "",
      rest: "Si besoin",
    });
  });

  it("formats the threshold help", () => {
    expect(formatThresholdHelp(t, 21, 7)).toBe("Soit 21 comprimés pour les 7 prochains jours.");
    expect(formatThresholdHelp(t, 1, 1)).toBe("Soit 1 comprimé pour le prochain jour.");
  });
});

describe("stock warnings formatters", () => {
  it("lists the meds below zero", () => {
    expect(formatStocksBelowZeroMessage(t, [lithium])).toBe(
      "Le stock de Lithium 250 mg est passé sous zéro. Pensez à mettre à jour les quantités dans Stock.",
    );
    expect(
      formatStocksBelowZeroMessage(t, [lithium, { name: "Lamictal", strength: "50 mg" }]),
    ).toBe(
      "Les stocks de Lithium 250 mg et Lamictal 50 mg sont passés sous zéro. Pensez à mettre à jour les quantités dans Stock.",
    );
  });

  it("formats the low stock notice", () => {
    expect(formatLowStockNotice(t, 1)).toBe(
      "Le stock d’un de vos médicaments est trop bas, pensez à le renouveler.",
    );
    expect(formatLowStockNotice(t, 3)).toBe(
      "Le stock de 3 de vos médicaments est trop bas, pensez à les renouveler.",
    );
  });
});

describe("in English", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("pluralizes the pills and the days", () => {
    expect(formatPillCount(t, 0)).toBe("0 pills");
    expect(formatPillCount(t, 1)).toBe("1 pill");
    expect(formatDayCount(t, 28)).toBe("28 days");
  });

  it("formats the low stock mention and the schedule", () => {
    expect(formatLowStockMention(t, "en", lowItem)).toBe("Low stock · until October 9");
    expect(formatThresholdHelp(t, 1, 1)).toBe("That's 1 pill for the next day.");
    expect(formatThresholdHelp(t, 21, 7)).toBe("That's 21 pills for the next 7 days.");
  });

  it("formats the warnings", () => {
    expect(formatLowStockNotice(t, 1)).toBe(
      "One of your medications is running low. Consider renewing it.",
    );
    expect(
      formatStocksBelowZeroMessage(t, [lithium, { name: "Lamictal", strength: "50 mg" }]),
    ).toBe(
      "The stocks of Lithium 250 mg and Lamictal 50 mg went below zero. Try updating the quantities in Stock.",
    );
  });
});
