import {
  areAllIntakesHandled,
  computeTodayIntakes,
  countTodayIntakes,
  countPendingPastIntakes,
  weekdayOf,
} from "./computeTodayIntakes";
import { createDate, createIntake, createIntakeLog } from "./testIntakes";
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
    const sections = computeTodayIntakes(INTAKES, [], createDate(7, 0));

    expect(summarize(sections)).toEqual({
      late: [],
      next: ["intake-8-20", 80],
      later: ["intake-12-20", "intake-20-20", "intake-22-0"],
    });
  });

  it("keeps the intake as next at its exact time", () => {
    const sections = computeTodayIntakes(INTAKES, [], createDate(8, 20));

    expect(sections.next?.intake.id).toBe("intake-8-20");
    expect(sections.next?.minutesFromNow).toBe(0);
    expect(sections.next?.status).toBe("next");
  });

  it("keeps the intake as next 59 minutes after its time", () => {
    const sections = computeTodayIntakes(INTAKES, [], createDate(9, 19));

    expect(sections.late).toEqual([]);
    expect(sections.next?.intake.id).toBe("intake-8-20");
    expect(sections.next?.minutesFromNow).toBe(-59);
  });

  it("keeps the intake as next 60 minutes after its time", () => {
    const sections = computeTodayIntakes(INTAKES, [], createDate(9, 20));

    expect(sections.next?.intake.id).toBe("intake-8-20");
  });

  it("marks the intake as late 61 minutes after its time", () => {
    const sections = computeTodayIntakes(INTAKES, [], createDate(9, 21));

    expect(summarize(sections)).toEqual({
      late: [["intake-8-20", -61]],
      next: ["intake-12-20", 179],
      later: ["intake-20-20", "intake-22-0"],
    });
    expect(sections.late[0].status).toBe("late");
    expect(sections.later[0].status).toBe("later");
  });

  it("marks several intakes as late", () => {
    const sections = computeTodayIntakes(INTAKES, [], createDate(13, 30));

    expect(summarize(sections)).toEqual({
      late: [
        ["intake-8-20", -310],
        ["intake-12-20", -70],
      ],
      next: ["intake-20-20", 410],
      later: ["intake-22-0"],
    });
  });

  it("has no next intake when every intake is late", () => {
    const sections = computeTodayIntakes(INTAKES, [], createDate(23, 45));

    expect(sections.late).toHaveLength(4);
    expect(sections.next).toBeNull();
    expect(sections.later).toEqual([]);
  });

  it("returns empty sections without intakes", () => {
    expect(computeTodayIntakes([], [], createDate(12, 0))).toEqual({
      late: [],
      next: null,
      later: [],
      earlier: [],
    });
  });

  it("moves an intake taken on time to earlier", () => {
    const logs = [createIntakeLog(INTAKES[0], "taken", { hour: 9, minute: 20 })];

    const sections = computeTodayIntakes(INTAKES, logs, createDate(9, 30));

    expect(sections.earlier).toEqual([
      {
        intake: INTAKES[0],
        status: "taken",
        minutesFromNow: -70,
        validation: { time: { hour: 9, minute: 20 }, isTakenLate: false },
      },
    ]);
    expect(sections.late).toEqual([]);
    expect(sections.next?.intake.id).toBe("intake-12-20");
  });

  it("marks an intake taken more than 60 minutes after its time as taken late", () => {
    const logs = [createIntakeLog(INTAKES[0], "taken", { hour: 9, minute: 21 })];

    const [earlier] = computeTodayIntakes(INTAKES, logs, createDate(9, 30)).earlier;

    expect(earlier.validation).toEqual({ time: { hour: 9, minute: 21 }, isTakenLate: true });
  });

  it("never marks a skipped intake as taken late", () => {
    const logs = [createIntakeLog(INTAKES[0], "skipped", { hour: 11, minute: 0 })];

    const [earlier] = computeTodayIntakes(INTAKES, logs, createDate(11, 0)).earlier;

    expect(earlier.status).toBe("skipped");
    expect(earlier.validation?.isTakenLate).toBe(false);
  });

  it("keeps the usual rules for the intakes without log", () => {
    const logs = [createIntakeLog(INTAKES[1], "taken", { hour: 12, minute: 0 })];

    const sections = computeTodayIntakes(INTAKES, logs, createDate(13, 0));

    expect(summarize(sections)).toEqual({
      late: [["intake-8-20", -280]],
      next: ["intake-20-20", 440],
      later: ["intake-22-0"],
    });
    expect(sections.earlier.map(({ intake }) => intake.id)).toEqual(["intake-12-20"]);
  });

  it("orders the earlier intakes by time", () => {
    const logs = [
      createIntakeLog(INTAKES[2], "taken", { hour: 20, minute: 20 }),
      createIntakeLog(INTAKES[0], "skipped", { hour: 21, minute: 0 }),
    ];

    const { earlier } = computeTodayIntakes(INTAKES, logs, createDate(21, 0));

    expect(earlier.map(({ intake }) => intake.id)).toEqual(["intake-8-20", "intake-20-20"]);
  });
});

describe("countTodayIntakes", () => {
  it("counts the intakes of every section", () => {
    expect(countTodayIntakes(computeTodayIntakes(INTAKES, [], createDate(13, 0)))).toBe(4);
    expect(countTodayIntakes(computeTodayIntakes([], [], createDate(13, 0)))).toBe(0);
  });

  it("counts the earlier intakes", () => {
    const logs = [createIntakeLog(INTAKES[0], "taken", { hour: 8, minute: 20 })];

    expect(countTodayIntakes(computeTodayIntakes(INTAKES, logs, createDate(13, 0)))).toBe(4);
  });
});

describe("areAllIntakesHandled", () => {
  const ALL_LOGS = INTAKES.map((intake) => createIntakeLog(intake, "taken", intake.time));

  it("is true when every intake has a log", () => {
    expect(areAllIntakesHandled(computeTodayIntakes(INTAKES, ALL_LOGS, createDate(23, 0)))).toBe(
      true,
    );
  });

  it("is false when an intake has no log", () => {
    const logs = ALL_LOGS.slice(1);

    expect(areAllIntakesHandled(computeTodayIntakes(INTAKES, logs, createDate(23, 0)))).toBe(false);
  });

  it("is false without intakes", () => {
    expect(areAllIntakesHandled(computeTodayIntakes([], [], createDate(23, 0)))).toBe(false);
  });
});

describe("countPendingPastIntakes", () => {
  it("is 0 before the time of the next intake", () => {
    expect(countPendingPastIntakes(computeTodayIntakes(INTAKES, [], createDate(8, 19)))).toBe(0);
  });

  it("counts the next intake from its time", () => {
    expect(countPendingPastIntakes(computeTodayIntakes(INTAKES, [], createDate(8, 20)))).toBe(1);
  });

  it("counts the late intakes and the next one", () => {
    expect(countPendingPastIntakes(computeTodayIntakes(INTAKES, [], createDate(12, 30)))).toBe(2);
  });

  it("is 0 once the past intakes are logged", () => {
    const logs = [createIntakeLog(INTAKES[0], "skipped", { hour: 9, minute: 0 })];

    expect(countPendingPastIntakes(computeTodayIntakes(INTAKES, logs, createDate(9, 0)))).toBe(0);
  });
});

describe("weekdayOf", () => {
  it("returns the weekday of a date", () => {
    expect(weekdayOf(new Date(2026, 9, 4))).toBe("sunday");
    expect(weekdayOf(new Date(2026, 9, 5))).toBe("monday");
    expect(weekdayOf(new Date(2026, 9, 10))).toBe("saturday");
  });
});
