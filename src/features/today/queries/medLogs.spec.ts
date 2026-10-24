import { medLogTable } from "@/shared/database/schema";
import { createTestDatabase } from "@/shared/database/testDatabase";
import { countRows } from "@/shared/database/testHelpers";
import type { Database } from "@/shared/database/types";

import { getAllMeds } from "@/features/pillbox/queries/getAllMeds";
import { deleteLastMedLogOfDay } from "./deleteLastMedLogOfDay";
import { getLastMedLogsOfDay } from "./getLastMedLogsOfDay";
import { insertMedLog } from "./insertMedLog";

function medIdOf(database: Database, name: string): string {
  return getAllMeds(database).find((med) => med.name === name)?.id ?? "";
}

function at(day: number, hour: number, minute: number): Date {
  return new Date(2026, 9, day, hour, minute);
}

describe("med logs", () => {
  it("returns the last log of the day for each med", () => {
    const database = createTestDatabase();
    const prazepamId = medIdOf(database, "Prazépam");
    const lithiumId = medIdOf(database, "Lithium");

    insertMedLog(database, prazepamId, at(14, 9, 5));
    insertMedLog(database, prazepamId, at(14, 15, 40));
    insertMedLog(database, lithiumId, at(14, 11, 0));
    insertMedLog(database, lithiumId, at(13, 23, 0));

    expect(getLastMedLogsOfDay(database, "2026-10-14")).toEqual(
      new Map([
        [prazepamId, "2026-10-14T15:40"],
        [lithiumId, "2026-10-14T11:00"],
      ]),
    );
  });

  it("returns nothing for a day without log", () => {
    expect(getLastMedLogsOfDay(createTestDatabase(), "2026-10-14").size).toBe(0);
  });

  it("deletes only the last log of the day for the med", () => {
    const database = createTestDatabase();
    const prazepamId = medIdOf(database, "Prazépam");
    const lithiumId = medIdOf(database, "Lithium");
    insertMedLog(database, prazepamId, at(14, 9, 5));
    insertMedLog(database, prazepamId, at(14, 15, 40));
    insertMedLog(database, prazepamId, at(15, 8, 0));
    insertMedLog(database, lithiumId, at(14, 16, 0));

    expect(deleteLastMedLogOfDay(database, prazepamId, "2026-10-14")).toBe(true);

    expect(getLastMedLogsOfDay(database, "2026-10-14")).toEqual(
      new Map([
        [prazepamId, "2026-10-14T09:05"],
        [lithiumId, "2026-10-14T16:00"],
      ]),
    );
    expect(countRows(database, medLogTable)).toBe(3);
  });

  it("deletes a single log when several share the same minute", () => {
    const database = createTestDatabase();
    const prazepamId = medIdOf(database, "Prazépam");
    insertMedLog(database, prazepamId, at(14, 9, 5));
    insertMedLog(database, prazepamId, at(14, 9, 5));

    deleteLastMedLogOfDay(database, prazepamId, "2026-10-14");

    expect(countRows(database, medLogTable)).toBe(1);
  });

  it("deletes nothing without log of the day", () => {
    const database = createTestDatabase();
    const prazepamId = medIdOf(database, "Prazépam");
    insertMedLog(database, prazepamId, at(13, 9, 5));

    expect(deleteLastMedLogOfDay(database, prazepamId, "2026-10-14")).toBe(false);
    expect(countRows(database, medLogTable)).toBe(1);
  });
});
