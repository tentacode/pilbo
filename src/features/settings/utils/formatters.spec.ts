import { formatAppVersion, formatDayCount } from "./formatters";

describe("formatAppVersion", () => {
  it("shows the version and the build", () => {
    expect(formatAppVersion("1.0.0", "12")).toBe("1.0.0 (12)");
  });

  it("shows the version alone without build", () => {
    expect(formatAppVersion("1.0.0", null)).toBe("1.0.0");
  });

  it("shows an unknown version", () => {
    expect(formatAppVersion(null, "12")).toBe("Inconnue");
  });
});

describe("formatDayCount", () => {
  it.each([
    [1, "1 jour"],
    [7, "7 jours"],
  ])("formats %i days", (days, expected) => {
    expect(formatDayCount(days)).toBe(expected);
  });
});
