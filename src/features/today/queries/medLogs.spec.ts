import { medLogTable } from "@/shared/database/schema";
import { createTestDatabase } from "@/shared/database/testDatabase";
import { countRows } from "@/shared/database/testHelpers";

import { findMedId } from "@/features/stocks/queries/testStocks";
import { deleteMedLog } from "./deleteMedLog";
import { getMedLogById } from "./getMedLogById";
import { insertMedLog } from "./insertMedLog";
import { updateMedLogTime } from "./updateMedLogTime";

function at(day: number, hour: number, minute: number): Date {
  return new Date(2026, 9, day, hour, minute);
}

describe("med logs", () => {
  it("inserts a log and reads it back by its identifier", () => {
    const database = createTestDatabase();
    const prazepamId = findMedId(database, "Prazépam", "25 mg");

    const medLogId = insertMedLog(database, prazepamId, at(14, 15, 40));

    expect(getMedLogById(database, medLogId)).toEqual({
      id: medLogId,
      med: expect.objectContaining({ id: prazepamId, name: "Prazépam" }),
      takenAt: "2026-10-14T15:40",
    });
  });

  it("returns undefined for an unknown log", () => {
    expect(getMedLogById(createTestDatabase(), "unknown")).toBeUndefined();
  });

  it("deletes only the given log", () => {
    const database = createTestDatabase();
    const prazepamId = findMedId(database, "Prazépam", "25 mg");
    const firstMedLogId = insertMedLog(database, prazepamId, at(14, 9, 5));
    const secondMedLogId = insertMedLog(database, prazepamId, at(14, 9, 5));

    deleteMedLog(database, secondMedLogId);

    expect(countRows(database, medLogTable)).toBe(1);
    expect(getMedLogById(database, firstMedLogId)).toBeDefined();
  });

  it("updates the time of a log", () => {
    const database = createTestDatabase();
    const prazepamId = findMedId(database, "Prazépam", "25 mg");
    const medLogId = insertMedLog(database, prazepamId, at(14, 15, 40));

    updateMedLogTime(database, medLogId, "2026-10-14T11:20");

    expect(getMedLogById(database, medLogId)?.takenAt).toBe("2026-10-14T11:20");
  });
});
