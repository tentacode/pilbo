import { toLocalDate } from "@/domain/intakeLog";

import { weeklyPreviewOf } from "./weeklyPreview";

describe("weeklyPreviewOf", () => {
  it("shows four weeks from the week of the start date, with paused weeks", () => {
    const weeks = weeklyPreviewOf(
      {
        frequency: "weekly",
        interval: 2,
        startsOn: "2026-11-04",
        days: ["monday", "wednesday", "friday"],
      },
      new Date(2026, 10, 2),
    );

    expect(
      weeks.map(({ monday, isActive, days }) => [
        toLocalDate(monday),
        isActive,
        days.filter(({ isDue }) => isDue).map(({ date }) => date.getDate()),
      ]),
    ).toEqual([
      ["2026-11-02", true, [4, 6]],
      ["2026-11-09", false, []],
      ["2026-11-16", true, [16, 18, 20]],
      ["2026-11-23", false, []],
    ]);
  });

  it("starts from the current week when the start date is past", () => {
    const [firstWeek] = weeklyPreviewOf(
      { frequency: "weekly", interval: 3, startsOn: "2026-10-01", days: ["monday"] },
      new Date(2026, 10, 20),
    );

    expect(toLocalDate(firstWeek.monday)).toBe("2026-11-16");
  });
});
