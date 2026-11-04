import { isSameTime, takenTimeOf, withTakenTime } from "./medLogTime";

describe("med log time", () => {
  it("reads the time of a log", () => {
    expect(takenTimeOf("2026-11-04T15:40")).toEqual({ hour: 15, minute: 40 });
  });

  it("changes the time and keeps the day", () => {
    expect(withTakenTime("2026-11-04T15:40", { hour: 9, minute: 5 })).toBe("2026-11-04T09:05");
  });

  it("compares two times", () => {
    expect(isSameTime({ hour: 9, minute: 5 }, { hour: 9, minute: 5 })).toBe(true);
    expect(isSameTime({ hour: 9, minute: 5 }, { hour: 9, minute: 6 })).toBe(false);
  });
});
