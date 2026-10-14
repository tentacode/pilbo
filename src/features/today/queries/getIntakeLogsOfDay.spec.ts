import { sql } from "drizzle-orm";

import { intakeTable } from "@/shared/database/schema";
import { createTestDatabase } from "@/shared/database/testDatabase";
import type { Database } from "@/shared/database/types";

import { getIntakeLogsOfDay } from "./getIntakeLogsOfDay";
import { insertIntakeLog } from "./insertIntakeLog";

function firstIntakeId(database: Database): string {
  return database.get<{ id: string }>(
    sql`SELECT ${intakeTable.id} AS id FROM ${intakeTable} LIMIT 1`,
  ).id;
}

describe("getIntakeLogsOfDay", () => {
  it("reads back an inserted log", () => {
    const database = createTestDatabase();
    const intakeId = firstIntakeId(database);

    insertIntakeLog(database, {
      intakeId,
      expectedIntakeAt: "2026-10-14T08:20",
      createdAt: "2026-10-14T09:05",
      status: "skipped",
    });

    expect(getIntakeLogsOfDay(database, "2026-10-14")).toEqual([
      {
        id: expect.any(String),
        intakeId,
        expectedIntakeAt: "2026-10-14T08:20",
        createdAt: "2026-10-14T09:05",
        status: "skipped",
      },
    ]);
  });

  it("keeps only the logs expected on the given day", () => {
    const database = createTestDatabase();
    const intakeId = firstIntakeId(database);
    insertIntakeLog(database, {
      intakeId,
      expectedIntakeAt: "2026-10-13T22:00",
      createdAt: "2026-10-14T00:10",
      status: "taken",
    });

    expect(getIntakeLogsOfDay(database, "2026-10-14")).toEqual([]);
    expect(getIntakeLogsOfDay(database, "2026-10-13")).toHaveLength(1);
  });

  it("returns the fixture log of the day", () => {
    const database = createTestDatabase({ withLogs: true, now: new Date(2026, 9, 14, 7, 0) });

    expect(getIntakeLogsOfDay(database, "2026-10-14")).toHaveLength(1);
  });
});

describe("insertIntakeLog", () => {
  it("prevents deleting an intake that has logs", () => {
    const database = createTestDatabase();
    const intakeId = firstIntakeId(database);
    insertIntakeLog(database, {
      intakeId,
      expectedIntakeAt: "2026-10-14T08:20",
      createdAt: "2026-10-14T08:25",
      status: "taken",
    });

    expect(() =>
      database
        .delete(intakeTable)
        .where(sql`${intakeTable.id} = ${intakeId}`)
        .run(),
    ).toThrow(/FOREIGN KEY constraint failed/);
  });
});
