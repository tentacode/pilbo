import { createTestDatabase } from "@/shared/database/testDatabase";

import { getAsNeededMeds } from "@/features/pillbox/queries/getAsNeededMeds";
import { findMedId } from "@/features/stocks/queries/testStocks";
import { getMedLogsOfDay } from "./getMedLogsOfDay";
import { insertMedLog } from "./insertMedLog";

describe("getMedLogsOfDay", () => {
  it("returns every med taken that day, with its time, ordered by time", () => {
    const database = createTestDatabase();
    const [prazepam] = getAsNeededMeds(database);
    const lithiumId = findMedId(database, "Lithium", "250 mg");
    insertMedLog(database, prazepam.id, new Date(2026, 9, 21, 18, 0));
    insertMedLog(database, lithiumId, new Date(2026, 9, 21, 9, 30));
    insertMedLog(database, prazepam.id, new Date(2026, 9, 21, 15, 40));
    insertMedLog(database, prazepam.id, new Date(2026, 9, 22, 8, 0));

    const medLogs = getMedLogsOfDay(database, "2026-10-21");

    expect(medLogs.map(({ med, takenAt }) => [med.name, takenAt])).toEqual([
      ["Lithium", "2026-10-21T09:30"],
      ["Prazépam", "2026-10-21T15:40"],
      ["Prazépam", "2026-10-21T18:00"],
    ]);
    expect(medLogs[1]).toEqual({
      id: expect.any(String),
      med: prazepam,
      takenAt: "2026-10-21T15:40",
    });
  });

  it("returns nothing on a day without logs", () => {
    expect(getMedLogsOfDay(createTestDatabase(), "2026-10-21")).toEqual([]);
  });
});
