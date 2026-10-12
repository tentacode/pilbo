import { computeTodayIntakes } from "./computeTodayIntakes";
import {
  formatDuration,
  formatDurationAccessibilityLabel,
  formatIntakeStatus,
  formatLateSectionTitle,
  formatSkipAccessibilityLabel,
  formatTakeAccessibilityLabel,
  formatTodayDate,
  formatTodaySummary,
} from "./formatters";
import { createDate, createIntake } from "./testIntakes";
import type { TodayIntake } from "./todayTypes";

const INTAKES = [
  createIntake(8, 20),
  createIntake(12, 20),
  createIntake(20, 20),
  createIntake(22, 0),
];

function createTodayIntake(status: TodayIntake["status"], minutesFromNow: number): TodayIntake {
  return { intake: createIntake(12, 20), status, minutesFromNow };
}

describe("formatTodayDate", () => {
  it.each([
    [new Date(2026, 9, 4), "Dimanche 4 octobre"],
    [new Date(2026, 9, 5), "Lundi 5 octobre"],
    [new Date(2026, 0, 1), "Jeudi 1 janvier"],
    [new Date(2026, 7, 15), "Samedi 15 août"],
    [new Date(2026, 11, 25), "Vendredi 25 décembre"],
  ])("formats %s as %s", (date, expected) => {
    expect(formatTodayDate(date)).toBe(expected);
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
    expect(formatDuration(minutes)).toBe(expected);
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
    expect(formatDurationAccessibilityLabel(minutes)).toBe(expected);
  });
});

describe("formatIntakeStatus", () => {
  it("formats an upcoming next intake", () => {
    expect(formatIntakeStatus(createTodayIntake("next", 145))).toEqual({
      text: "Dans 2 h 25",
      accessibilityLabel: "Dans 2 heures 25 minutes",
    });
  });

  it("formats a next intake at its time or in its margin", () => {
    const expected = { text: "C'est l'heure", accessibilityLabel: "C'est l'heure" };

    expect(formatIntakeStatus(createTodayIntake("next", 0))).toEqual(expected);
    expect(formatIntakeStatus(createTodayIntake("next", -29))).toEqual(expected);
  });

  it("formats a late intake", () => {
    expect(formatIntakeStatus(createTodayIntake("late", -40))).toEqual({
      text: "En retard · 40 min",
      accessibilityLabel: "En retard de 40 minutes",
    });
  });

  it("formats a later intake", () => {
    expect(formatIntakeStatus(createTodayIntake("later", 300))).toEqual({
      text: "À venir",
      accessibilityLabel: "À venir",
    });
  });
});

describe("formatTodaySummary", () => {
  it("shows the next intake when nothing is late", () => {
    expect(formatTodaySummary(computeTodayIntakes(INTAKES, createDate(7, 0)))).toEqual({
      progress: "0 prise sur 4",
      detail: "prochaine à 08:20",
      accessibilityLabel: "0 prise sur 4, prochaine à 08:20",
    });
  });

  it("shows the number of late intakes", () => {
    expect(formatTodaySummary(computeTodayIntakes(INTAKES, createDate(13, 0)))).toEqual({
      progress: "0 prise sur 4",
      detail: "2 en retard",
      accessibilityLabel: "0 prise sur 4, 2 en retard",
    });
  });

  it("shows the late intakes when every intake is late", () => {
    expect(formatTodaySummary(computeTodayIntakes(INTAKES, createDate(23, 45)))?.detail).toBe(
      "4 en retard",
    );
  });

  it("returns nothing without intakes", () => {
    expect(formatTodaySummary(computeTodayIntakes([], createDate(10, 0)))).toBeNull();
  });
});

describe("formatLateSectionTitle", () => {
  it("has no title for a single late intake", () => {
    expect(formatLateSectionTitle(1)).toBeNull();
  });

  it("counts the late intakes from two", () => {
    expect(formatLateSectionTitle(2)).toBe("2 prises en retard");
    expect(formatLateSectionTitle(3)).toBe("3 prises en retard");
  });
});

describe("button accessibility labels", () => {
  it("names the intake time", () => {
    const intake = createIntake(12, 20);

    expect(formatTakeAccessibilityLabel(intake)).toBe("Prendre la prise de 12:20");
    expect(formatSkipAccessibilityLabel(intake)).toBe("Ignorer la prise de 12:20");
  });
});
