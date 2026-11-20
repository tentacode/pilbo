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
const translatePillbox = i18n.getFixedT(null, "pillbox");

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
    frequency: "daily",
    interval: 1,
    startsOn: "2026-10-01",
    reminderIntervalMinutes: 10,
    sound: "beep",
    medQuantities: [{ med: lithium, quantity: 2 }],
  };
  const evening: Intake = { ...morning, id: "evening", time: { hour: 20, minute: 30 } };

  it("shows the time of a single every day intake", () => {
    expect(formatMedSchedule(t, translatePillbox, "fr", lithium, [morning])).toEqual({
      subtitle: "1 prise à 08:30",
    });
  });

  it("adds the recurrence of a single custom intake on a second line", () => {
    expect(
      formatMedSchedule(t, translatePillbox, "fr", lithium, [
        { ...morning, frequency: "weekly", interval: 2, days: ["tuesday", "wednesday"] },
      ]),
    ).toEqual({
      subtitle: "1 prise à 08:30",
      detail: "Mardi et mercredi, une semaine sur deux",
    });
    expect(
      formatMedSchedule(t, translatePillbox, "fr", lithium, [{ ...morning, days: ["monday"] }]),
    ).toEqual({ subtitle: "1 prise à 08:30", detail: "Lundi" });
  });

  it("counts several intakes", () => {
    expect(formatMedSchedule(t, translatePillbox, "fr", lithium, [morning, evening])).toEqual({
      subtitle: "2 prises",
    });
  });

  it("counts a monthly intake as planned", () => {
    expect(
      formatMedSchedule(t, translatePillbox, "fr", lithium, [
        { ...morning, frequency: "monthly", days: [] },
      ]),
    ).toEqual({ subtitle: "1 prise à 08:30", detail: "Le 1er de chaque mois" });
  });

  it("is translated in English", async () => {
    await i18n.changeLanguage("en");

    expect(
      formatMedSchedule(t, translatePillbox, "en", lithium, [
        { ...morning, frequency: "monthly", days: [] },
      ]),
    ).toEqual({ subtitle: "1 intake at 08:30", detail: "On the 1st of every month" });
    expect(formatMedSchedule(t, translatePillbox, "en", lithium, [morning, evening])).toEqual({
      subtitle: "2 intakes",
    });
  });

  it("describes a med without schedule", () => {
    expect(formatMedSchedule(t, translatePillbox, "fr", lithium, [])).toEqual({
      subtitle: "Aucune prise prévue",
    });
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
