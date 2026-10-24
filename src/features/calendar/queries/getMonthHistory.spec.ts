import { createTestDatabase } from "@/shared/database/testDatabase";

import { getMonthHistory } from "./getMonthHistory";

const NOW = new Date(2026, 9, 24, 7, 0);

describe("getMonthHistory", () => {
  it("returns the intake versions covering the month, with both versions of an edited intake", () => {
    const database = createTestDatabase({ withLogs: true, now: NOW });

    const { intakeVersions } = getMonthHistory(database, { year: 2026, month: 9 });

    expect(intakeVersions).toHaveLength(5);
    expect(intakeVersions.filter(({ time }) => time.hour === 12)).toEqual([
      {
        id: expect.any(String),
        time: { hour: 12, minute: 0 },
        days: expect.arrayContaining(["monday", "sunday"]),
        createdOn: "2026-09-09",
        archivedOn: "2026-10-14",
      },
      {
        id: expect.any(String),
        time: { hour: 12, minute: 20 },
        days: expect.arrayContaining(["monday", "sunday"]),
        createdOn: "2026-10-14",
        archivedOn: null,
      },
    ]);
  });

  it("returns only the logs of the month", () => {
    const database = createTestDatabase({ withLogs: true, now: NOW });

    const { intakeLogs } = getMonthHistory(database, { year: 2026, month: 8 });

    expect(intakeLogs.length).toBeGreaterThan(0);
    expect(intakeLogs.every(({ expectedIntakeAt }) => expectedIntakeAt.startsWith("2026-09"))).toBe(
      true,
    );
  });

  it("ignores the versions created after or archived before the month", () => {
    const database = createTestDatabase({ withLogs: true, now: NOW });

    expect(getMonthHistory(database, { year: 2026, month: 7 }).intakeVersions).toEqual([]);
    expect(
      getMonthHistory(database, { year: 2026, month: 10 }).intakeVersions.map(({ time }) => time),
    ).not.toContainEqual({ hour: 12, minute: 0 });
  });
});
