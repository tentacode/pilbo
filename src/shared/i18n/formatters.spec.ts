import {
  capitalize,
  formatDayAndMonth,
  formatFullDate,
  formatLongDateWithYear,
  formatShortDate,
  formatIntakeTime,
  formatWeekday,
} from "./formatters";

describe("formatIntakeTime", () => {
  it("formats a 24-hour time", () => {
    expect(formatIntakeTime({ hour: 8, minute: 5 }, true)).toBe("08:05");
    expect(formatIntakeTime({ hour: 22, minute: 30 }, true)).toBe("22:30");
  });

  it("formats a 12-hour time", () => {
    expect(formatIntakeTime({ hour: 8, minute: 5 }, false)).toBe("8:05 AM");
    expect(formatIntakeTime({ hour: 22, minute: 30 }, false)).toBe("10:30 PM");
    expect(formatIntakeTime({ hour: 0, minute: 0 }, false)).toBe("12:00 AM");
    expect(formatIntakeTime({ hour: 12, minute: 15 }, false)).toBe("12:15 PM");
  });

  it("follows the system clock by default", () => {
    expect(formatIntakeTime({ hour: 8, minute: 5 })).toBe("08:05");
  });
});

describe("formatWeekday", () => {
  it("formats long and short weekday names", () => {
    expect(formatWeekday("monday", "fr", "long")).toBe("lundi");
    expect(formatWeekday("sunday", "en", "long")).toBe("Sunday");
    expect(formatWeekday("wednesday", "fr", "short")).toBe("mer");
    expect(formatWeekday("wednesday", "en", "short")).toBe("Wed");
  });
});

describe("formatDayAndMonth", () => {
  it("formats a day and a month", () => {
    expect(formatDayAndMonth(new Date(2026, 9, 14), "fr")).toBe("14 octobre");
    expect(formatDayAndMonth(new Date(2026, 9, 14), "en")).toBe("October 14");
  });

  it("writes the first of the month as « 1er » in French", () => {
    expect(formatDayAndMonth(new Date(2026, 9, 1), "fr")).toBe("1er octobre");
    expect(formatDayAndMonth(new Date(2026, 9, 1), "en")).toBe("October 1");
  });
});

describe("formatFullDate", () => {
  it("formats the weekday, the day and the month", () => {
    expect(formatFullDate(new Date(2026, 9, 14), "fr")).toBe("Mercredi 14 octobre");
    expect(formatFullDate(new Date(2026, 9, 14), "en")).toBe("Wednesday, October 14");
  });
});

describe("formatShortDate", () => {
  it("formats the day, the short month and the year", () => {
    expect(formatShortDate(new Date(2026, 9, 15), "fr")).toBe("15 oct. 2026");
    expect(formatShortDate(new Date(2026, 4, 1), "fr")).toBe("1er mai 2026");
    expect(formatShortDate(new Date(2026, 9, 15), "en")).toBe("Oct 15, 2026");
    expect(formatShortDate(new Date(2026, 9, 1), "en")).toBe("Oct 1, 2026");
  });
});

describe("formatLongDateWithYear", () => {
  it("formats the full date with the year", () => {
    expect(formatLongDateWithYear(new Date(2026, 9, 15), "fr")).toBe("jeudi 15 octobre 2026");
    expect(formatLongDateWithYear(new Date(2026, 9, 15), "en")).toBe("Thursday, October 15, 2026");
  });
});

describe("capitalize", () => {
  it("capitalizes the first letter", () => {
    expect(capitalize("lundi")).toBe("Lundi");
  });
});
