import { fromLocalDateTime, toLocalDate, toLocalDateTime } from "./intakeLog";

describe("toLocalDate", () => {
  it("pads the month and the day with zeros", () => {
    expect(toLocalDate(new Date(2026, 0, 5, 8, 20))).toBe("2026-01-05");
  });

  it("keeps two digit values", () => {
    expect(toLocalDate(new Date(2026, 9, 14))).toBe("2026-10-14");
  });
});

describe("toLocalDateTime", () => {
  it("pads every part with zeros", () => {
    expect(toLocalDateTime(new Date(2026, 0, 5, 8, 5))).toBe("2026-01-05T08:05");
  });

  it("ignores the seconds", () => {
    expect(toLocalDateTime(new Date(2026, 9, 14, 22, 30, 45))).toBe("2026-10-14T22:30");
  });
});

describe("fromLocalDateTime", () => {
  it("reads a local date and time", () => {
    expect(fromLocalDateTime("2026-10-14T08:20")).toEqual(new Date(2026, 9, 14, 8, 20));
  });

  it("round trips with toLocalDateTime", () => {
    const text = "2026-01-05T22:00";

    expect(toLocalDateTime(fromLocalDateTime(text))).toBe(text);
  });
});
