import { WEEKDAYS } from "@/domain/intake";
import type { IntakeLog } from "@/domain/intakeLog";

import type { MonthHistory } from "@/features/calendar/queries/getMonthHistory";
import type { CalendarDay, IntakeVersion } from "./calendarTypes";
import { computeMonthDays, toCalendarWeeks } from "./monthGrid";

const OCTOBER = { year: 2026, month: 9 };
const NOW = new Date(2026, 9, 24, 9, 0);

function version(changes: Partial<IntakeVersion> = {}): IntakeVersion {
  return {
    id: "morning",
    time: { hour: 8, minute: 20 },
    days: [...WEEKDAYS],
    createdOn: "2026-09-01",
    archivedOn: null,
    ...changes,
  };
}

function takenLog(intakeId: string, localDate: string, time = "08:20"): IntakeLog {
  return {
    id: `${intakeId}-${localDate}`,
    intakeId,
    expectedIntakeAt: `${localDate}T${time}`,
    createdAt: `${localDate}T${time}`,
    status: "taken",
  };
}

function statusOn(days: CalendarDay[], dayOfMonth: number): string {
  return days[dayOfMonth - 1].status;
}

describe("computeMonthDays", () => {
  it("computes the status of each past day of the month", () => {
    const history: MonthHistory = {
      intakeVersions: [version()],
      intakeLogs: [takenLog("morning", "2026-10-20")],
    };

    const days = computeMonthDays(history, OCTOBER, NOW, "2026-09-01");

    expect(days).toHaveLength(31);
    expect(days[19]).toEqual({
      localDate: "2026-10-20",
      dayOfMonth: 20,
      status: "taken",
      isToday: false,
      isSelectable: true,
    });
    expect(statusOn(days, 21)).toBe("missed");
  });

  it("uses the version of the intake that covers each day", () => {
    const history: MonthHistory = {
      intakeVersions: [
        version({ id: "old", archivedOn: "2026-10-14" }),
        version({ id: "new", time: { hour: 9, minute: 0 }, createdOn: "2026-10-14" }),
      ],
      intakeLogs: [takenLog("old", "2026-10-13"), takenLog("new", "2026-10-14", "09:00")],
    };

    const days = computeMonthDays(history, OCTOBER, NOW, "2026-09-01");

    expect(statusOn(days, 13)).toBe("taken");
    expect(statusOn(days, 14)).toBe("taken");
  });

  it("is none on days without planned intake", () => {
    const history: MonthHistory = {
      intakeVersions: [version({ days: ["monday"] })],
      intakeLogs: [],
    };

    const days = computeMonthDays(history, OCTOBER, NOW, "2026-09-01");

    expect(statusOn(days, 19)).toBe("missed");
    expect(statusOn(days, 20)).toBe("none");
  });

  it("only looks at handled or late intakes today", () => {
    const history: MonthHistory = {
      intakeVersions: [version({ time: { hour: 8, minute: 20 } })],
      intakeLogs: [],
    };

    expect(
      computeMonthDays(history, OCTOBER, new Date(2026, 9, 24, 9, 0), "2026-09-01")[23],
    ).toMatchObject({
      status: "none",
      isToday: true,
      isSelectable: true,
    });
    expect(
      statusOn(computeMonthDays(history, OCTOBER, new Date(2026, 9, 24, 9, 30), "2026-09-01"), 24),
    ).toBe("missed");
  });

  it("makes future days and days before the history not selectable", () => {
    const days = computeMonthDays(
      { intakeVersions: [version()], intakeLogs: [] },
      OCTOBER,
      NOW,
      "2026-10-05",
    );

    expect(days[3]).toMatchObject({ status: "none", isSelectable: false });
    expect(days[4]).toMatchObject({ status: "missed", isSelectable: true });
    expect(days[24]).toMatchObject({ status: "none", isSelectable: false });
  });

  it("makes no day selectable without history", () => {
    const days = computeMonthDays({ intakeVersions: [], intakeLogs: [] }, OCTOBER, NOW, null);

    expect(days.some(({ isSelectable }) => isSelectable)).toBe(false);
  });
});

describe("toCalendarWeeks", () => {
  function weeksOf(year: number, month: number) {
    return toCalendarWeeks(
      computeMonthDays({ intakeVersions: [], intakeLogs: [] }, { year, month }, NOW, null),
    );
  }

  it("aligns the days from Monday to Sunday, with blanks before the first day", () => {
    const weeks = weeksOf(2026, 9);

    expect(weeks).toHaveLength(5);
    expect(weeks[0].map((day) => day?.dayOfMonth ?? null)).toEqual([null, null, null, 1, 2, 3, 4]);
    expect(weeks[4].map((day) => day?.dayOfMonth ?? null)).toEqual([26, 27, 28, 29, 30, 31, null]);
  });

  it("starts without blank on a month starting on Monday", () => {
    const weeks = weeksOf(2026, 5);

    expect(weeks[0][0]?.dayOfMonth).toBe(1);
  });

  it("puts the first day last on a month starting on Sunday", () => {
    const weeks = weeksOf(2026, 10);

    expect(weeks[0].map((day) => day?.dayOfMonth ?? null)).toEqual([
      null,
      null,
      null,
      null,
      null,
      null,
      1,
    ]);
    expect(weeks).toHaveLength(6);
  });
});
