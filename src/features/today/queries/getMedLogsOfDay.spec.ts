import { createTestDatabase } from "@/shared/database/testDatabase";

import { getMedById } from "@/features/pillbox/queries/getMedById";
import { findMedId } from "@/features/stocks/queries/testStocks";
import { getMedLogsOfDay } from "./getMedLogsOfDay";
import { insertMedLog } from "./insertMedLog";

describe("getMedLogsOfDay", () => {
  it("returns every med taken that day, with its time, ordered by time", () => {
    const database = createTestDatabase();
    const paracetamol = getMedById(database, findMedId(database, "Paracétamol", "500 mg"));
    if (paracetamol === undefined) {
      throw new Error("Missing Paracétamol");
    }
    const magnesiumId = findMedId(database, "Magnésium", "300 mg");
    insertMedLog(database, paracetamol.id, new Date(2026, 9, 21, 18, 0));
    insertMedLog(database, magnesiumId, new Date(2026, 9, 21, 9, 30));
    insertMedLog(database, paracetamol.id, new Date(2026, 9, 21, 15, 40));
    insertMedLog(database, paracetamol.id, new Date(2026, 9, 22, 8, 0));

    const medLogs = getMedLogsOfDay(database, "2026-10-21");

    expect(medLogs.map(({ med, takenAt }) => [med.name, takenAt])).toEqual([
      ["Magnésium", "2026-10-21T09:30"],
      ["Paracétamol", "2026-10-21T15:40"],
      ["Paracétamol", "2026-10-21T18:00"],
    ]);
    expect(medLogs[1]).toEqual({
      id: expect.any(String),
      med: paracetamol,
      takenAt: "2026-10-21T15:40",
    });
  });

  it("returns nothing on a day without logs", () => {
    expect(getMedLogsOfDay(createTestDatabase(), "2026-10-21")).toEqual([]);
  });
});
