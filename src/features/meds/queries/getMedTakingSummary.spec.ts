import { intakeLogTable } from "@/shared/database/schema";
import { createTestDatabase } from "@/shared/database/testDatabase";

import { getAllIntakes } from "@/features/pillbox/queries/getAllIntakes";
import { findMedId } from "@/features/stocks/queries/testStocks";
import { insertMedLog } from "@/features/today/queries/insertMedLog";
import { getMedTakingSummary } from "./getMedTakingSummary";

describe("getMedTakingSummary", () => {
  it("adds the free takings and the taken intakes of the day, with their quantities", () => {
    const database = createTestDatabase();
    const lithiumId = findMedId(database, "Lithium", "250 mg");
    const [, , evening] = getAllIntakes(database);
    database
      .insert(intakeLogTable)
      .values([
        {
          intakeId: evening.id,
          expectedIntakeAt: "2026-11-04T20:20",
          createdAt: "2026-11-04T20:25",
          status: "taken",
        },
        {
          intakeId: evening.id,
          expectedIntakeAt: "2026-11-03T20:20",
          createdAt: "2026-11-03T20:25",
          status: "taken",
        },
      ])
      .run();
    insertMedLog(database, lithiumId, new Date(2026, 10, 4, 15, 40));

    expect(getMedTakingSummary(database, lithiumId, "2026-11-04")).toEqual({
      todayQuantity: 3,
      lastTakenAt: "2026-11-04T20:25",
    });
  });

  it("ignores the skipped intakes and the other meds", () => {
    const database = createTestDatabase();
    const lithiumId = findMedId(database, "Lithium", "250 mg");
    const [morning] = getAllIntakes(database);
    database
      .insert(intakeLogTable)
      .values({
        intakeId: morning.id,
        expectedIntakeAt: "2026-11-04T08:20",
        createdAt: "2026-11-04T08:25",
        status: "skipped",
      })
      .run();
    insertMedLog(database, findMedId(database, "Prazépam", "25 mg"), new Date(2026, 10, 4, 9, 0));

    expect(getMedTakingSummary(database, lithiumId, "2026-11-04")).toEqual({ todayQuantity: 0 });
  });

  it("returns the last taking of a previous day", () => {
    const database = createTestDatabase();
    const prazepamId = findMedId(database, "Prazépam", "25 mg");
    insertMedLog(database, prazepamId, new Date(2026, 10, 1, 9, 0));
    insertMedLog(database, prazepamId, new Date(2026, 10, 2, 15, 40));

    expect(getMedTakingSummary(database, prazepamId, "2026-11-04")).toEqual({
      todayQuantity: 0,
      lastTakenAt: "2026-11-02T15:40",
    });
  });
});
