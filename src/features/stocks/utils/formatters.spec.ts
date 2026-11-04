import { type Intake, WEEKDAYS } from "@/domain/intake";
import type { Med } from "@/domain/med";
import { formatDayAndMonth } from "@/shared/i18n/formatters";
import { i18n } from "@/shared/i18n/i18n";

import {
  formatCoverage,
  formatDayCount,
  formatLowStockNotice,
  formatMedSchedule,
  formatPillCount,
  formatStocksBelowZeroMessage,
  formatThresholdHelp,
} from "./formatters";
import type { StockForecast } from "./stockForecast";

const t = i18n.getFixedT(null, "stocks");

const lithium: Med = {
  id: "lithium",
  name: "Lithium",
  strength: "250 mg",
  detail: "",
  design: { shape: "round", colors: ["#D6C9F5", "#D6C9F5"], size: "medium" },
};

const sufficientForecast: StockForecast = {
  status: "sufficient",
  daysLeft: 28,
  lastCoveredDate: new Date(2026, 10, 1),
  lowStockDate: new Date(2026, 9, 25),
};
const emptyForecast: StockForecast = {
  status: "low",
  daysLeft: 0,
  lastCoveredDate: new Date(2026, 9, 18),
};

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
  });

  it("formats the coverage", () => {
    expect(formatCoverage(t, "fr", sufficientForecast)).toEqual({
      emphasis: "28 jours",
      rest: ", jusqu’au 1er novembre",
    });
    expect(formatCoverage(t, "fr", emptyForecast)).toEqual({
      emphasis: "0 jour",
      rest: ", à renouveler",
    });
    expect(formatCoverage(t, "fr", { status: "noSchedule" })).toEqual({
      emphasis: "",
      rest: "Aucune prise prévue",
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
      "Le stock de Lithium 250 mg est passé sous zéro. Pensez à mettre à jour les quantités dans Médicaments.",
    );
    expect(
      formatStocksBelowZeroMessage(t, [lithium, { name: "Lamictal", strength: "50 mg" }]),
    ).toBe(
      "Les stocks de Lithium 250 mg et Lamictal 50 mg sont passés sous zéro. Pensez à mettre à jour les quantités dans Médicaments.",
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

  it("formats the threshold help", () => {
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
      "The stocks of Lithium 250 mg and Lamictal 50 mg went below zero. Try updating the quantities in Meds.",
    );
  });
});
