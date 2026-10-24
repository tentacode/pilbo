import { i18n } from "@/shared/i18n/i18n";

import { formatAppVersion, formatDayCount } from "./formatters";

const t = i18n.getFixedT(null, "settings");

describe("formatAppVersion", () => {
  it("shows the version and the build", () => {
    expect(formatAppVersion(t, "1.0.0", "12")).toBe("1.0.0 (12)");
  });

  it("shows the version alone without build", () => {
    expect(formatAppVersion(t, "1.0.0", null)).toBe("1.0.0");
  });

  it("shows an unknown version", () => {
    expect(formatAppVersion(t, null, "12")).toBe("Inconnue");
  });

  it("shows an unknown version in English", async () => {
    await i18n.changeLanguage("en");

    expect(formatAppVersion(t, null, "12")).toBe("Unknown");
  });
});

describe("formatDayCount", () => {
  it.each([
    [1, "1 jour"],
    [7, "7 jours"],
  ])("formats %i days", (days, expected) => {
    expect(formatDayCount(t, days)).toBe(expected);
  });

  it("formats the days in English", async () => {
    await i18n.changeLanguage("en");

    expect(formatDayCount(t, 1)).toBe("1 day");
    expect(formatDayCount(t, 7)).toBe("7 days");
  });
});
