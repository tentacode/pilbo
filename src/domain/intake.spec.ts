import {
  type Intake,
  intakeDateOn,
  isEveryDay,
  sortIntakeMeds,
  WEEKDAYS,
  weekdayOf,
} from "./intake";
import type { Med } from "./med";

function createMed(name: string, strength: string): Med {
  return {
    id: `${name}-${strength}`,
    name,
    strength,
    detail: "",
    design: { shape: "oval", colors: ["#FFFFFF", "#FFFFFF"], size: "medium" },
  };
}

describe("sortIntakeMeds", () => {
  it("sorts the meds of an intake", () => {
    const intake: Intake = {
      id: "night",
      time: { hour: 22, minute: 0 },
      days: ["monday"],
      frequency: "daily",
      interval: 1,
      startsOn: "2026-10-01",
      reminderIntervalMinutes: 10,
      sound: "beep",
      medQuantities: [
        { med: createMed("Quviviq", "50 mg"), quantity: 1 },
        { med: createMed("Lamictal", "100 mg"), quantity: 2 },
      ],
    };

    expect(
      sortIntakeMeds(intake).medQuantities.map(({ med }) => `${med.name} ${med.strength}`),
    ).toEqual(["Lamictal 100 mg", "Quviviq 50 mg"]);
  });
});

describe("intakeDateOn", () => {
  it("places the intake time on the given day", () => {
    expect(intakeDateOn(new Date(2026, 9, 14, 23, 59), { hour: 8, minute: 20 })).toEqual(
      new Date(2026, 9, 14, 8, 20),
    );
  });
});

describe("weekdayOf", () => {
  it("returns the weekday of a date", () => {
    expect(weekdayOf(new Date(2026, 9, 4))).toBe("sunday");
    expect(weekdayOf(new Date(2026, 9, 5))).toBe("monday");
    expect(weekdayOf(new Date(2026, 9, 10))).toBe("saturday");
  });
});

describe("isEveryDay", () => {
  it("is true only for a daily intake on every weekday", () => {
    const recurrence = {
      frequency: "daily" as const,
      interval: 1,
      startsOn: "2026-11-02",
      days: [...WEEKDAYS],
    };

    expect(isEveryDay(recurrence)).toBe(true);
    expect(isEveryDay({ ...recurrence, days: ["monday"] })).toBe(false);
    expect(isEveryDay({ ...recurrence, frequency: "weekly", interval: 2 })).toBe(false);
  });
});
