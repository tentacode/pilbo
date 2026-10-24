import { sql } from "drizzle-orm";

import {
  intakeLogTable,
  intakeMedTable,
  intakeTable,
  medLogTable,
  medTable,
  stockTable,
} from "./schema";
import { seedDatabase } from "./seed";
import { createTestDatabase } from "./testDatabase";
import { countRows } from "./testHelpers";

describe("seedDatabase", () => {
  it("inserts the meds, the intakes, their links and the stocks", () => {
    const database = createTestDatabase();

    expect(countRows(database, medTable)).toBe(6);
    expect(countRows(database, intakeTable)).toBe(4);
    expect(countRows(database, intakeMedTable)).toBe(7);
    expect(countRows(database, stockTable)).toBe(3);
  });

  it("creates the intakes 45 days before now", () => {
    const database = createTestDatabase({ now: new Date(2026, 9, 24, 7, 0) });

    const records = database.all<{ createdOn: string; archivedOn: string | null }>(sql`
      SELECT ${intakeTable.createdOn} AS createdOn, ${intakeTable.archivedOn} AS archivedOn
      FROM ${intakeTable}
    `);

    expect(records).toHaveLength(4);
    expect(records).toEqual(
      Array.from({ length: 4 }, () => ({ createdOn: "2026-09-09", archivedOn: null })),
    );
  });

  it("does not seed again when the database already has meds", () => {
    const database = createTestDatabase();

    seedDatabase(database, { withLogs: false });

    expect(countRows(database, medTable)).toBe(6);
    expect(countRows(database, intakeTable)).toBe(4);
  });

  it("generates UUIDs as identifiers", () => {
    const database = createTestDatabase();

    const { id } = database.get<{ id: string }>(
      sql`SELECT ${medTable.id} AS id FROM ${medTable} LIMIT 1`,
    );

    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it("inserts no log by default", () => {
    expect(countRows(createTestDatabase(), intakeLogTable)).toBe(0);
  });

  it("inserts the late morning log of the day with logs", () => {
    const database = createTestDatabase({ withLogs: true, now: new Date(2026, 9, 14, 7, 0) });

    const logs = database.all<{
      hour: number;
      expectedIntakeAt: string;
      createdAt: string;
      status: string;
    }>(sql`
      SELECT
        ${intakeTable.hour} AS hour,
        ${intakeLogTable.expectedIntakeAt} AS expectedIntakeAt,
        ${intakeLogTable.createdAt} AS createdAt,
        ${intakeLogTable.status} AS status
      FROM ${intakeLogTable}
      INNER JOIN ${intakeTable} ON ${intakeTable.id} = ${intakeLogTable.intakeId}
      WHERE ${intakeLogTable.expectedIntakeAt} LIKE '2026-10-14%'
    `);

    expect(logs).toEqual([
      {
        hour: 8,
        expectedIntakeAt: "2026-10-14T08:20",
        createdAt: "2026-10-14T09:35",
        status: "taken",
      },
    ]);
  });

  describe("with logs", () => {
    const NOW = new Date(2026, 9, 24, 7, 0);

    function readLogsOfDay(
      localDate: string,
    ): { time: string; status: string; createdAt: string }[] {
      const database = createTestDatabase({ withLogs: true, now: NOW });
      return database.all(sql`
        SELECT
          substr(${intakeLogTable.expectedIntakeAt}, 12) AS time,
          ${intakeLogTable.status} AS status,
          substr(${intakeLogTable.createdAt}, 12) AS createdAt
        FROM ${intakeLogTable}
        WHERE ${intakeLogTable.expectedIntakeAt} LIKE ${localDate} || '%'
        ORDER BY ${intakeLogTable.expectedIntakeAt}
      `);
    }

    it("keeps two versions of the lunch intake edited 10 days ago", () => {
      const database = createTestDatabase({ withLogs: true, now: NOW });

      const versions = database.all(sql`
        SELECT
          ${intakeTable.hour} AS hour,
          ${intakeTable.minute} AS minute,
          ${intakeTable.createdOn} AS createdOn,
          ${intakeTable.archivedOn} AS archivedOn,
          ${intakeTable.isArchived} AS isArchived
        FROM ${intakeTable}
        WHERE ${intakeTable.hour} = 12
        ORDER BY ${intakeTable.createdOn}
      `);

      expect(countRows(database, intakeTable)).toBe(5);
      expect(versions).toEqual([
        { hour: 12, minute: 0, createdOn: "2026-09-09", archivedOn: "2026-10-14", isArchived: 1 },
        { hour: 12, minute: 20, createdOn: "2026-10-14", archivedOn: null, isArchived: 0 },
      ]);
    });

    it("takes every intake of a regular day, on the version of that day", () => {
      expect(readLogsOfDay("2026-10-23")).toEqual([
        { time: "08:20", status: "taken", createdAt: "08:25" },
        { time: "12:20", status: "taken", createdAt: "12:25" },
        { time: "20:20", status: "taken", createdAt: "20:25" },
        { time: "22:00", status: "taken", createdAt: "22:05" },
      ]);
      expect(readLogsOfDay("2026-10-13").map(({ time }) => time)).toEqual([
        "08:20",
        "12:00",
        "20:20",
        "22:00",
      ]);
    });

    it("generates late, skipped and forgotten days", () => {
      expect(readLogsOfDay("2026-10-21")[0]).toEqual({
        time: "08:20",
        status: "taken",
        createdAt: "09:55",
      });
      expect(readLogsOfDay("2026-10-18").map(({ status }) => status)).toEqual([
        "skipped",
        "skipped",
        "skipped",
        "skipped",
      ]);
      expect(readLogsOfDay("2026-10-15")).toEqual([]);
      expect(readLogsOfDay("2026-10-09")).toHaveLength(3);
      expect(readLogsOfDay("2026-09-09")).toHaveLength(4);
      expect(readLogsOfDay("2026-09-08")).toEqual([]);
    });

    it("inserts as-needed logs on past days", () => {
      const database = createTestDatabase({ withLogs: true, now: NOW });

      expect(countRows(database, medLogTable)).toBe(5);
    });
  });
});
