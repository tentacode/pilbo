import {
  formatAsNeededTakenAt,
  formatDayTitle,
  formatDuration,
  formatDurationAccessibilityLabel,
  formatEarlierIntakeAccessibilityLabel,
  formatIntakeStatus,
  formatLateSectionTitle,
  formatMedNames,
  formatNextDayAccessibilityLabel,
  formatPreviousDayAccessibilityLabel,
  formatSkipAccessibilityLabel,
  formatTakeAccessibilityLabel,
  formatSwitcherDate,
  formatUpcomingIntakeSentence,
  formatValidationAnnouncement,
} from "./formatters";
import { i18n } from "@/shared/i18n/i18n";

import { createIntake } from "./testIntakes";
import type { TodayIntake } from "./todayTypes";

const t = i18n.getFixedT(null, "today");

function createTodayIntake(status: TodayIntake["status"], minutesFromNow: number): TodayIntake {
  return { intake: createIntake(12, 20), status, minutesFromNow };
}

describe("formatSwitcherDate", () => {
  it.each([
    ["2026-10-04", "4 oct. 2026", "dimanche 4 octobre 2026"],
    ["2026-01-01", "1er janv. 2026", "jeudi 1 janvier 2026"],
    ["2026-08-15", "15 août 2026", "samedi 15 août 2026"],
  ])("formats %s as %s", (localDate, text, accessibilityLabel) => {
    expect(formatSwitcherDate(localDate, "fr")).toEqual({ text, accessibilityLabel });
  });
});

describe("formatDuration", () => {
  it.each([
    [1, "1 min"],
    [45, "45 min"],
    [-40, "40 min"],
    [60, "1 h"],
    [180, "3 h"],
    [125, "2 h 05"],
    [145, "2 h 25"],
    [-280, "4 h 40"],
  ])("formats %i minutes as %s", (minutes, expected) => {
    expect(formatDuration(t, minutes)).toBe(expected);
  });
});

describe("formatDurationAccessibilityLabel", () => {
  it.each([
    [1, "1 minute"],
    [45, "45 minutes"],
    [60, "1 heure"],
    [180, "3 heures"],
    [61, "1 heure 1 minute"],
    [125, "2 heures 5 minutes"],
    [-40, "40 minutes"],
  ])("formats %i minutes as %s", (minutes, expected) => {
    expect(formatDurationAccessibilityLabel(t, minutes)).toBe(expected);
  });
});

describe("formatDayTitle", () => {
  it.each([
    ["2026-10-24", "Aujourd'hui"],
    ["2026-10-23", "Hier"],
    ["2026-10-22", "Avant-hier"],
    ["2026-10-21", "Mercredi 21 octobre"],
    ["2026-09-30", "Mercredi 30 septembre"],
  ])("titles %s as %s", (localDate, expected) => {
    expect(formatDayTitle(t, localDate, "2026-10-24", "fr")).toBe(expected);
  });

  it("handles yesterday across months", () => {
    expect(formatDayTitle(t, "2026-10-31", "2026-11-01", "fr")).toBe("Hier");
  });
});

describe("day navigation accessibility labels", () => {
  it("names the target day", () => {
    expect(formatPreviousDayAccessibilityLabel(t, "2026-10-19", "fr")).toBe(
      "Jour précédent : lundi 19 octobre",
    );
    expect(formatNextDayAccessibilityLabel(t, "2026-10-21", "fr")).toBe(
      "Jour suivant : mercredi 21 octobre",
    );
  });
});

describe("formatIntakeStatus", () => {
  it("formats a missed intake", () => {
    expect(formatIntakeStatus(t, createTodayIntake("missed", 0))).toEqual({
      text: "Non prise",
      accessibilityLabel: "Non prise",
    });
  });

  it("formats an upcoming next intake", () => {
    expect(formatIntakeStatus(t, createTodayIntake("next", 145))).toEqual({
      text: "Dans 2 h 25",
      accessibilityLabel: "Dans 2 heures 25 minutes",
    });
  });

  it("formats a next intake at its time or in its margin", () => {
    const expected = { text: "C'est l'heure", accessibilityLabel: "C'est l'heure" };

    expect(formatIntakeStatus(t, createTodayIntake("next", 0))).toEqual(expected);
    expect(formatIntakeStatus(t, createTodayIntake("next", -29))).toEqual(expected);
  });

  it("formats a late intake", () => {
    expect(formatIntakeStatus(t, createTodayIntake("late", -40))).toEqual({
      text: "En retard · 40 min",
      accessibilityLabel: "En retard de 40 minutes",
    });
  });

  it("formats an intake taken on time", () => {
    const todayIntake: TodayIntake = {
      ...createTodayIntake("taken", -40),
      validation: { time: { hour: 9, minute: 5 }, isTakenLate: false },
    };

    expect(formatIntakeStatus(t, todayIntake)).toEqual({
      text: "Pris à 09:05",
      accessibilityLabel: "Pris à 09:05",
    });
  });

  it("formats an intake taken late", () => {
    const todayIntake: TodayIntake = {
      ...createTodayIntake("taken", -40),
      validation: { time: { hour: 9, minute: 5 }, isTakenLate: true },
    };

    expect(formatIntakeStatus(t, todayIntake).text).toBe("Pris en retard à 09:05");
  });

  it("formats a skipped intake", () => {
    expect(formatIntakeStatus(t, createTodayIntake("skipped", -40))).toEqual({
      text: "Ignorée",
      accessibilityLabel: "Ignorée",
    });
  });

  it("formats a later intake", () => {
    expect(formatIntakeStatus(t, createTodayIntake("later", 300))).toEqual({
      text: "À venir",
      accessibilityLabel: "À venir",
    });
  });
});

describe("formatLateSectionTitle", () => {
  it("has no title for a single late intake", () => {
    expect(formatLateSectionTitle(t, 1)).toBeNull();
  });

  it("counts the late intakes from two", () => {
    expect(formatLateSectionTitle(t, 2)).toBe("2 prises en retard");
    expect(formatLateSectionTitle(t, 3)).toBe("3 prises en retard");
  });
});

describe("formatMedNames", () => {
  it("joins the meds and shows a quantity above one", () => {
    const intake = createIntake(8, 20);
    const [lithium] = intake.medQuantities;
    const lamictal = {
      med: { ...lithium.med, id: "lamictal", name: "Lamictal", strength: "50 mg" },
      quantity: 1,
    };

    expect(formatMedNames([lithium, lamictal])).toBe("Lithium 250 mg · Lamictal 50 mg");
    expect(formatMedNames([{ ...lithium, quantity: 2 }])).toBe("Lithium 250 mg (2 ×)");
  });
});

describe("formatEarlierIntakeAccessibilityLabel", () => {
  it("names the time, the status and the meds", () => {
    const todayIntake: TodayIntake = {
      ...createTodayIntake("taken", -40),
      validation: { time: { hour: 13, minute: 0 }, isTakenLate: true },
    };

    expect(formatEarlierIntakeAccessibilityLabel(t, todayIntake)).toBe(
      "12:20, Pris en retard à 13:00, Lithium 250 mg, quantité 1",
    );
  });
});

describe("button accessibility labels", () => {
  it("names the intake time", () => {
    const intake = createIntake(12, 20);

    expect(formatTakeAccessibilityLabel(t, intake)).toBe("Prendre la prise de 12:20");
    expect(formatSkipAccessibilityLabel(t, intake)).toBe("Ignorer la prise de 12:20");
  });
});

describe("formatValidationAnnouncement", () => {
  it.each([
    ["taken", "Prise de 12:20 validée"],
    ["skipped", "Prise de 12:20 ignorée"],
  ] as const)("announces a %s intake", (status, expected) => {
    expect(formatValidationAnnouncement(t, createIntake(12, 20), status)).toBe(expected);
  });
});

describe("formatAsNeededTakenAt", () => {
  it("shows the time of the last intake", () => {
    expect(formatAsNeededTakenAt(t, "2026-10-14T09:05")).toBe("Pris à 09:05");
  });
});

describe("formatUpcomingIntakeSentence", () => {
  it.each([
    [1, "sunday", "Prochaine prise demain à 08:05."],
    [2, "monday", "Prochaine prise lundi à 08:05."],
    [7, "saturday", "Prochaine prise samedi prochain à 08:05."],
  ] as const)("formats %s day(s) ahead on %s", (daysAhead, weekday, expected) => {
    expect(
      formatUpcomingIntakeSentence(t, "fr", { daysAhead, weekday, intake: createIntake(8, 5) }),
    ).toBe(expected);
  });
});

describe("in English", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("formats the date", () => {
    expect(formatSwitcherDate("2026-10-05", "en")).toEqual({
      text: "Oct 5, 2026",
      accessibilityLabel: "Monday, October 5, 2026",
    });
  });

  it("formats the day titles and navigation labels", () => {
    expect(formatDayTitle(t, "2026-10-24", "2026-10-24", "en")).toBe("Today");
    expect(formatDayTitle(t, "2026-10-23", "2026-10-24", "en")).toBe("Yesterday");
    expect(formatDayTitle(t, "2026-10-22", "2026-10-24", "en")).toBe("Day before yesterday");
    expect(formatDayTitle(t, "2026-10-21", "2026-10-24", "en")).toBe("Wednesday, October 21");
    expect(formatPreviousDayAccessibilityLabel(t, "2026-10-19", "en")).toBe(
      "Previous day: Monday, October 19",
    );
    expect(formatIntakeStatus(t, createTodayIntake("missed", 0)).text).toBe("Not taken");
  });

  it("formats durations", () => {
    expect(formatDuration(t, 45)).toBe("45 min");
    expect(formatDuration(t, 125)).toBe("2h 05m");
    expect(formatDurationAccessibilityLabel(t, 61)).toBe("1 hour 1 minute");
    expect(formatDurationAccessibilityLabel(t, 125)).toBe("2 hours 5 minutes");
  });

  it("formats the statuses", () => {
    expect(formatIntakeStatus(t, createTodayIntake("late", -40))).toEqual({
      text: "Late · 40 min",
      accessibilityLabel: "Late by 40 minutes",
    });
    expect(formatIntakeStatus(t, createTodayIntake("later", 300)).text).toBe("Upcoming");
  });

  it("formats the late section title", () => {
    expect(formatLateSectionTitle(t, 2)).toBe("2 late intakes");
  });

  it.each([
    [1, "sunday", "Next intake tomorrow at 08:05."],
    [2, "monday", "Next intake on Monday at 08:05."],
    [7, "saturday", "Next intake next Saturday at 08:05."],
  ] as const)("formats %s day(s) ahead on %s", (daysAhead, weekday, expected) => {
    expect(
      formatUpcomingIntakeSentence(t, "en", { daysAhead, weekday, intake: createIntake(8, 5) }),
    ).toBe(expected);
  });
});
