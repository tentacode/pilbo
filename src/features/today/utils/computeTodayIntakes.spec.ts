import { computeTodayIntakes, countTodayIntakes, weekdayOf } from "./computeTodayIntakes";
import { createDate, createIntake } from "./testIntakes";
import type { TodaySections } from "./todayTypes";

const INTAKES = [
  createIntake(8, 20),
  createIntake(12, 20),
  createIntake(20, 20),
  createIntake(22, 0),
];

function summarize({ late, next, later }: TodaySections) {
  return {
    late: late.map(({ intake, minutesFromNow }) => [intake.id, minutesFromNow]),
    next: next ? [next.intake.id, next.minutesFromNow] : null,
    later: later.map(({ intake }) => intake.id),
  };
}

describe("computeTodayIntakes", () => {
  it("has no late intake before every intake", () => {
    const sections = computeTodayIntakes(INTAKES, createDate(7, 0));

    expect(summarize(sections)).toEqual({
      late: [],
      next: ["intake-8-20", 80],
      later: ["intake-12-20", "intake-20-20", "intake-22-0"],
    });
  });

  it("keeps the intake as next at its exact time", () => {
    const sections = computeTodayIntakes(INTAKES, createDate(8, 20));

    expect(sections.next?.intake.id).toBe("intake-8-20");
    expect(sections.next?.minutesFromNow).toBe(0);
    expect(sections.next?.status).toBe("next");
  });

  it("keeps the intake as next 29 minutes after its time", () => {
    const sections = computeTodayIntakes(INTAKES, createDate(8, 49));

    expect(sections.late).toEqual([]);
    expect(sections.next?.intake.id).toBe("intake-8-20");
    expect(sections.next?.minutesFromNow).toBe(-29);
  });

  it("keeps the intake as next 30 minutes after its time", () => {
    const sections = computeTodayIntakes(INTAKES, createDate(8, 50));

    expect(sections.next?.intake.id).toBe("intake-8-20");
  });

  it("marks the intake as late 31 minutes after its time", () => {
    const sections = computeTodayIntakes(INTAKES, createDate(8, 51));

    expect(summarize(sections)).toEqual({
      late: [["intake-8-20", -31]],
      next: ["intake-12-20", 209],
      later: ["intake-20-20", "intake-22-0"],
    });
    expect(sections.late[0].status).toBe("late");
    expect(sections.later[0].status).toBe("later");
  });

  it("marks several intakes as late", () => {
    const sections = computeTodayIntakes(INTAKES, createDate(13, 0));

    expect(summarize(sections)).toEqual({
      late: [
        ["intake-8-20", -280],
        ["intake-12-20", -40],
      ],
      next: ["intake-20-20", 440],
      later: ["intake-22-0"],
    });
  });

  it("has no next intake when every intake is late", () => {
    const sections = computeTodayIntakes(INTAKES, createDate(23, 45));

    expect(sections.late).toHaveLength(4);
    expect(sections.next).toBeNull();
    expect(sections.later).toEqual([]);
  });

  it("returns empty sections without intakes", () => {
    expect(computeTodayIntakes([], createDate(12, 0))).toEqual({
      late: [],
      next: null,
      later: [],
    });
  });
});

describe("countTodayIntakes", () => {
  it("counts the intakes of every section", () => {
    expect(countTodayIntakes(computeTodayIntakes(INTAKES, createDate(13, 0)))).toBe(4);
    expect(countTodayIntakes(computeTodayIntakes([], createDate(13, 0)))).toBe(0);
  });
});

describe("weekdayOf", () => {
  it("returns the weekday of a date", () => {
    expect(weekdayOf(new Date(2026, 9, 4))).toBe("sunday");
    expect(weekdayOf(new Date(2026, 9, 5))).toBe("monday");
    expect(weekdayOf(new Date(2026, 9, 10))).toBe("saturday");
  });
});
