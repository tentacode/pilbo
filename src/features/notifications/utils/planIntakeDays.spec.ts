import { toLocalDate } from "@/domain/intakeLog";

import { createIntake } from "@/features/today/utils/testIntakes";
import { horizonEndOf, planIntakeDays } from "./planIntakeDays";

const DAILY = createIntake(8, 20);

function plannedDays(intakeDays: ReturnType<typeof planIntakeDays>): string[] {
  return intakeDays.map(({ day }) => toLocalDate(day));
}

describe("planIntakeDays", () => {
  it("starts today, at midnight, and ends the same day one year later", () => {
    const intakeDays = planIntakeDays([DAILY], new Date(2026, 9, 14, 7, 0));

    expect(intakeDays[0].day).toEqual(new Date(2026, 9, 14));
    expect(intakeDays[0].intakes).toEqual([DAILY]);
    expect(plannedDays(intakeDays).at(-1)).toBe("2027-10-14");
    expect(intakeDays).toHaveLength(366);
  });

  it("omits the days without a due intake, such as a paused week", () => {
    const everyOtherWeek = {
      ...DAILY,
      frequency: "weekly" as const,
      interval: 2,
      startsOn: "2026-10-12",
    };

    const intakeDays = planIntakeDays([everyOtherWeek], new Date(2026, 9, 14));

    expect(plannedDays(intakeDays).slice(0, 7)).toEqual([
      "2026-10-14",
      "2026-10-15",
      "2026-10-16",
      "2026-10-17",
      "2026-10-18",
      "2026-10-26",
      "2026-10-27",
    ]);
  });

  it("keeps only the intakes due on each day", () => {
    const monthly = {
      ...createIntake(9, 0),
      frequency: "monthly" as const,
      startsOn: "2026-09-04",
      days: [],
    };

    const intakeDays = planIntakeDays([DAILY, monthly], new Date(2026, 9, 14));

    expect(intakeDays[0].intakes).toEqual([DAILY]);
    expect(intakeDays[21]).toEqual({ day: new Date(2026, 10, 4), intakes: [DAILY, monthly] });
  });

  it("plans an intake every six months twice within the horizon", () => {
    const everySixMonths = {
      ...DAILY,
      frequency: "monthly" as const,
      interval: 6,
      startsOn: "2026-04-14",
      days: [],
    };

    const intakeDays = planIntakeDays([everySixMonths], new Date(2026, 9, 15));

    expect(plannedDays(intakeDays)).toEqual(["2027-04-14", "2027-10-14"]);
  });

  it("includes the same day one year later", () => {
    const yearly = {
      ...DAILY,
      frequency: "monthly" as const,
      interval: 12,
      startsOn: "2025-10-14",
      days: [],
    };

    expect(plannedDays(planIntakeDays([yearly], new Date(2026, 9, 14, 23, 0)))).toEqual([
      "2026-10-14",
      "2027-10-14",
    ]);
    expect(plannedDays(planIntakeDays([yearly], new Date(2026, 9, 15)))).toEqual(["2027-10-14"]);
  });

  it("ends on the 1st of March one year after a 29th of February", () => {
    expect(horizonEndOf(new Date(2028, 1, 29, 10, 0))).toEqual(new Date(2029, 2, 2));
  });

  it("keeps one day per calendar day across a change of time", () => {
    const intakeDays = planIntakeDays([DAILY], new Date(2026, 9, 24, 12, 0));

    expect(intakeDays.slice(0, 3).map(({ day }) => day)).toEqual([
      new Date(2026, 9, 24),
      new Date(2026, 9, 25),
      new Date(2026, 9, 26),
    ]);
  });
});
