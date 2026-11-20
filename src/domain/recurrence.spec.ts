import { type IntakeRecurrence, WEEKDAYS } from "./intake";
import { toLocalDate } from "./intakeLog";
import { isIntakeDueOn, nextDueDate, nextDueDates } from "./recurrence";

function dueDatesBetween(recurrence: IntakeRecurrence, from: Date, to: Date): string[] {
  const dueDates: string[] = [];
  for (
    let day = from;
    day <= to;
    day = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1)
  ) {
    if (isIntakeDueOn(recurrence, day)) {
      dueDates.push(toLocalDate(day));
    }
  }
  return dueDates;
}

const everyDay: IntakeRecurrence = {
  frequency: "daily",
  interval: 1,
  startsOn: "2026-11-02",
  days: [...WEEKDAYS],
};

describe("isIntakeDueOn", () => {
  it("is never due before the start date", () => {
    expect(isIntakeDueOn(everyDay, new Date(2026, 10, 1))).toBe(false);
    expect(isIntakeDueOn(everyDay, new Date(2026, 10, 2))).toBe(true);
  });

  it("follows the weekdays in daily frequency", () => {
    const recurrence: IntakeRecurrence = { ...everyDay, days: ["monday", "wednesday"] };

    expect(dueDatesBetween(recurrence, new Date(2026, 10, 2), new Date(2026, 10, 8))).toEqual([
      "2026-11-02",
      "2026-11-04",
    ]);
  });

  it("counts weeks from the week containing the start date", () => {
    const recurrence: IntakeRecurrence = {
      frequency: "weekly",
      interval: 2,
      startsOn: "2026-11-04",
      days: ["monday", "wednesday", "friday"],
    };

    expect(dueDatesBetween(recurrence, new Date(2026, 10, 2), new Date(2026, 10, 22))).toEqual([
      "2026-11-04",
      "2026-11-06",
      "2026-11-16",
      "2026-11-18",
      "2026-11-20",
    ]);
  });

  it("supports one week out of three and four", () => {
    const recurrence: IntakeRecurrence = {
      frequency: "weekly",
      interval: 3,
      startsOn: "2026-11-02",
      days: ["monday"],
    };

    expect(dueDatesBetween(recurrence, new Date(2026, 10, 2), new Date(2026, 11, 31))).toEqual([
      "2026-11-02",
      "2026-11-23",
      "2026-12-14",
    ]);
    expect(
      dueDatesBetween(
        { ...recurrence, interval: 4 },
        new Date(2026, 10, 2),
        new Date(2026, 11, 31),
      ),
    ).toEqual(["2026-11-02", "2026-11-30", "2026-12-28"]);
  });

  it("keeps counting weeks across a new year", () => {
    const recurrence: IntakeRecurrence = {
      frequency: "weekly",
      interval: 2,
      startsOn: "2026-12-21",
      days: ["thursday"],
    };

    expect(dueDatesBetween(recurrence, new Date(2026, 11, 21), new Date(2027, 0, 31))).toEqual([
      "2026-12-24",
      "2027-01-07",
      "2027-01-21",
    ]);
  });

  it("is not shifted by daylight saving time changes", () => {
    const recurrence: IntakeRecurrence = {
      frequency: "weekly",
      interval: 2,
      startsOn: "2026-03-23",
      days: ["sunday"],
    };

    expect(dueDatesBetween(recurrence, new Date(2026, 2, 23), new Date(2026, 3, 30))).toEqual([
      "2026-03-29",
      "2026-04-12",
      "2026-04-26",
    ]);
  });

  it("falls back to the last day of shorter months", () => {
    const recurrence: IntakeRecurrence = {
      frequency: "monthly",
      interval: 1,
      startsOn: "2026-01-31",
      days: [],
    };

    expect(dueDatesBetween(recurrence, new Date(2026, 0, 1), new Date(2026, 4, 31))).toEqual([
      "2026-01-31",
      "2026-02-28",
      "2026-03-31",
      "2026-04-30",
      "2026-05-31",
    ]);
  });

  it("uses February 29th in leap years", () => {
    const recurrence: IntakeRecurrence = {
      frequency: "monthly",
      interval: 1,
      startsOn: "2027-12-30",
      days: [],
    };

    expect(dueDatesBetween(recurrence, new Date(2028, 1, 1), new Date(2028, 1, 29))).toEqual([
      "2028-02-29",
    ]);
  });

  it("skips months with an interval, across years", () => {
    const recurrence: IntakeRecurrence = {
      frequency: "monthly",
      interval: 6,
      startsOn: "2026-11-02",
      days: [],
    };

    expect(dueDatesBetween(recurrence, new Date(2026, 10, 1), new Date(2028, 0, 1))).toEqual([
      "2026-11-02",
      "2027-05-02",
      "2027-11-02",
    ]);
  });

  it("ignores weekdays in monthly frequency", () => {
    const recurrence: IntakeRecurrence = {
      frequency: "monthly",
      interval: 2,
      startsOn: "2026-11-02",
      days: ["tuesday"],
    };

    expect(isIntakeDueOn(recurrence, new Date(2027, 0, 2))).toBe(true);
    expect(isIntakeDueOn(recurrence, new Date(2026, 11, 2))).toBe(false);
  });
});

describe("nextDueDate", () => {
  const recurrence: IntakeRecurrence = {
    frequency: "weekly",
    interval: 2,
    startsOn: "2026-11-02",
    days: ["monday", "friday"],
  };

  it("returns today when due and not handled yet", () => {
    expect(nextDueDate(recurrence, new Date(2026, 10, 16, 21, 0), false)).toEqual(
      new Date(2026, 10, 16),
    );
  });

  it("returns the next due date when today is handled", () => {
    expect(nextDueDate(recurrence, new Date(2026, 10, 16, 21, 0), true)).toEqual(
      new Date(2026, 10, 20),
    );
  });

  it("skips paused weeks", () => {
    expect(nextDueDate(recurrence, new Date(2026, 10, 7), false)).toEqual(new Date(2026, 10, 16));
  });

  it("starts from the start date when it is in the future", () => {
    expect(
      nextDueDate({ ...recurrence, startsOn: "2027-03-01" }, new Date(2026, 10, 7), false),
    ).toEqual(new Date(2027, 2, 1));
  });

  it("returns null without any weekday", () => {
    expect(nextDueDate({ ...recurrence, days: [] }, new Date(2026, 10, 7), false)).toBeNull();
  });
});

describe("nextDueDates", () => {
  it("lists the next monthly dates", () => {
    const recurrence: IntakeRecurrence = {
      frequency: "monthly",
      interval: 1,
      startsOn: "2026-11-30",
      days: [],
    };

    expect(nextDueDates(recurrence, new Date(2026, 10, 20), 4).map(toLocalDate)).toEqual([
      "2026-11-30",
      "2026-12-30",
      "2027-01-30",
      "2027-02-28",
    ]);
  });
});
