import { type IntakeRecurrence, WEEKDAYS } from "@/domain/intake";
import { i18n } from "@/shared/i18n/i18n";

import {
  formatMonthlyHelp,
  formatNextIntake,
  formatRecurrence,
  formatStartsOn,
  formatStartsOnAccessibilityLabel,
  formatStartsOnValue,
  formatWeeklyPreviewAccessibilityLabel,
  formatWeekRange,
} from "./recurrenceFormatters";
import { weeklyPreviewOf } from "./weeklyPreview";

const t = i18n.getFixedT(null, "pillbox");

const MONDAY = new Date(2026, 10, 2, 9, 0);

const everyDay: IntakeRecurrence = {
  frequency: "daily",
  interval: 1,
  startsOn: "2026-11-02",
  days: [...WEEKDAYS],
};

const mondayWednesdayFriday: IntakeRecurrence = {
  ...everyDay,
  days: ["friday", "monday", "wednesday"],
};

describe("formatRecurrence", () => {
  it("describes the daily recurrences", () => {
    expect(formatRecurrence(t, "fr", everyDay)).toBe("Tous les jours");
    expect(formatRecurrence(t, "fr", mondayWednesdayFriday)).toBe("Lundi, mercredi et vendredi");
    expect(formatRecurrence(t, "fr", { ...everyDay, days: ["sunday"] })).toBe("Dimanche");
  });

  it("describes the weekly recurrences", () => {
    const weekly: IntakeRecurrence = { ...mondayWednesdayFriday, frequency: "weekly" };

    expect(formatRecurrence(t, "fr", { ...weekly, interval: 2 })).toBe(
      "Lundi, mercredi et vendredi, une semaine sur deux",
    );
    expect(formatRecurrence(t, "fr", { ...weekly, interval: 3 })).toBe(
      "Lundi, mercredi et vendredi, une semaine sur trois",
    );
    expect(formatRecurrence(t, "fr", { ...everyDay, frequency: "weekly", interval: 4 })).toBe(
      "Tous les jours, une semaine sur quatre",
    );
  });

  it("describes the monthly recurrences", () => {
    const monthly: IntakeRecurrence = { ...everyDay, frequency: "monthly" };

    expect(formatRecurrence(t, "fr", monthly)).toBe("Le 2 de chaque mois");
    expect(formatRecurrence(t, "fr", { ...monthly, startsOn: "2026-12-01" })).toBe(
      "Le 1er de chaque mois",
    );
    expect(formatRecurrence(t, "fr", { ...monthly, interval: 2 })).toBe("Le 2, un mois sur deux");
    expect(formatRecurrence(t, "fr", { ...monthly, interval: 6 })).toBe("Le 2, un mois sur six");
  });

  it("is translated in English", async () => {
    await i18n.changeLanguage("en");

    expect(formatRecurrence(t, "en", everyDay)).toBe("Every day");
    expect(
      formatRecurrence(t, "en", { ...mondayWednesdayFriday, frequency: "weekly", interval: 2 }),
    ).toBe("Monday, Wednesday and Friday, every other week");
    expect(
      formatRecurrence(t, "en", { ...everyDay, frequency: "monthly", startsOn: "2026-11-22" }),
    ).toBe("On the 22nd of every month");
    expect(formatRecurrence(t, "en", { ...everyDay, frequency: "monthly", interval: 3 })).toBe(
      "On the 2nd, every 3 months",
    );
  });
});

describe("formatNextIntake", () => {
  it("says today, tomorrow or the date", () => {
    expect(formatNextIntake(t, "fr", new Date(2026, 10, 2), MONDAY)).toBe(
      "Prochaine : aujourd'hui",
    );
    expect(formatNextIntake(t, "fr", new Date(2026, 10, 3), MONDAY)).toBe("Prochaine : demain");
    expect(formatNextIntake(t, "fr", new Date(2026, 11, 2), MONDAY)).toBe(
      "Prochaine : mercredi 2 décembre",
    );
    expect(formatNextIntake(t, "fr", new Date(2027, 0, 1), MONDAY)).toBe(
      "Prochaine : vendredi 1er janvier 2027",
    );
  });

  it("is translated in English", async () => {
    await i18n.changeLanguage("en");

    expect(formatNextIntake(t, "en", new Date(2026, 10, 3), MONDAY)).toBe("Next: tomorrow");
    expect(formatNextIntake(t, "en", new Date(2026, 11, 2), MONDAY)).toBe(
      "Next: Wednesday, December 2",
    );
  });
});

describe("start date", () => {
  it("formats today", () => {
    expect(formatStartsOn(t, "fr", "2026-11-02", MONDAY)).toBe(
      "À partir d'aujourd'hui, lundi 2 novembre",
    );
    expect(formatStartsOnValue(t, "fr", "2026-11-02", MONDAY)).toBe("Aujourd'hui, 2 nov.");
    expect(formatStartsOnAccessibilityLabel(t, "fr", "2026-11-02", MONDAY)).toBe(
      "Date de début : aujourd'hui, lundi 2 novembre",
    );
  });

  it("formats another day", () => {
    expect(formatStartsOn(t, "fr", "2026-11-12", MONDAY)).toBe("À partir du jeudi 12 novembre");
    expect(formatStartsOnValue(t, "fr", "2026-11-12", MONDAY)).toBe("Jeu. 12 nov.");
    expect(formatStartsOnAccessibilityLabel(t, "fr", "2026-11-12", MONDAY)).toBe(
      "Date de début : jeudi 12 novembre",
    );
  });

  it("is translated in English", async () => {
    await i18n.changeLanguage("en");

    expect(formatStartsOn(t, "en", "2026-11-02", MONDAY)).toBe(
      "Starting today, Monday, November 2",
    );
    expect(formatStartsOnValue(t, "en", "2026-11-12", MONDAY)).toBe("Thu, Nov 12");
  });
});

describe("formatMonthlyHelp", () => {
  const monthly: IntakeRecurrence = { ...everyDay, frequency: "monthly" };

  it("says the day of the month", () => {
    expect(formatMonthlyHelp(t, "fr", monthly, false)).toBe("Puis le 2 de chaque mois.");
    expect(formatMonthlyHelp(t, "fr", { ...monthly, interval: 2 }, false)).toBe(
      "Puis le 2 du mois.",
    );
  });

  it("explains the shorter months", () => {
    expect(formatMonthlyHelp(t, "fr", { ...monthly, startsOn: "2026-12-31" }, true)).toBe(
      "Puis le 31 de chaque mois. Le 29, 30 ou 31 : les mois plus courts, ce sera le dernier jour du mois.",
    );
  });
});

describe("weekly preview", () => {
  it("formats the week ranges", () => {
    expect(formatWeekRange(new Date(2026, 10, 2), "fr")).toBe("2–8 nov.");
    expect(formatWeekRange(new Date(2026, 10, 30), "fr")).toBe("30 nov.–6 déc.");
    expect(formatWeekRange(new Date(2026, 10, 2), "en")).toBe("Nov 2–8");
  });

  it("describes the preview for screen readers", () => {
    const weeks = weeklyPreviewOf(
      { ...mondayWednesdayFriday, frequency: "weekly", interval: 2 },
      MONDAY,
    ).slice(0, 2);

    expect(formatWeeklyPreviewAccessibilityLabel(t, "fr", weeks)).toBe(
      "Aperçu : Semaine du 2 novembre : lundi, mercredi et vendredi. Semaine du 9 novembre : pause",
    );
  });
});
