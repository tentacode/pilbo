import {
  formatDuration,
  formatDurationAccessibilityLabel,
  formatEarlierIntakeAccessibilityLabel,
  formatIntakeStatus,
  formatLateSectionTitle,
  formatMedNames,
  formatSkipAccessibilityLabel,
  formatTakeAccessibilityLabel,
  formatTodayDate,
} from "./formatters";
import { createIntake } from "./testIntakes";
import type { TodayIntake } from "./todayTypes";

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

  it("formats an intake taken on time", () => {
    const todayIntake: TodayIntake = {
      ...createTodayIntake("taken", -40),
      validation: { time: { hour: 9, minute: 5 }, isTakenLate: false },
    };

    expect(formatIntakeStatus(todayIntake)).toEqual({
      text: "Pris à 09:05",
      accessibilityLabel: "Pris à 09:05",
    });
  });

  it("formats an intake taken late", () => {
    const todayIntake: TodayIntake = {
      ...createTodayIntake("taken", -40),
      validation: { time: { hour: 9, minute: 5 }, isTakenLate: true },
    };

    expect(formatIntakeStatus(todayIntake).text).toBe("Pris en retard à 09:05");
  });

  it("formats a skipped intake", () => {
    expect(formatIntakeStatus(createTodayIntake("skipped", -40))).toEqual({
      text: "Ignorée",
      accessibilityLabel: "Ignorée",
    });
  });

  it("formats a later intake", () => {
    expect(formatIntakeStatus(createTodayIntake("later", 300))).toEqual({
      text: "À venir",
      accessibilityLabel: "À venir",
    });
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

    expect(formatEarlierIntakeAccessibilityLabel(todayIntake)).toBe(
      "12:20, Pris en retard à 13:00, Lithium 250 mg, quantité 1",
    );
  });
});

describe("button accessibility labels", () => {
  it("names the intake time", () => {
    const intake = createIntake(12, 20);

    expect(formatTakeAccessibilityLabel(intake)).toBe("Prendre la prise de 12:20");
    expect(formatSkipAccessibilityLabel(intake)).toBe("Ignorer la prise de 12:20");
  });
});
