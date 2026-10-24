import { intakeLogTable } from "@/shared/database/schema";
import { createTestDatabase } from "@/shared/database/testDatabase";

import { archiveIntake } from "@/features/pillbox/queries/archiveIntake";
import { getStocksData } from "./getStocksData";
import { saveStock } from "./saveStock";
import { findMedId } from "./testStocks";

const NOW = new Date(2026, 9, 19, 9, 0);

describe("getStocksData", () => {
  it("returns the stocks, the active intakes and the logs of the day", () => {
    const database = createTestDatabase();
    const medId = findMedId(database, "Quviviq", "50 mg");
    saveStock(database, { medId, quantity: 12, boxSize: 28, lowStockDays: 5 });
    const [firstIntake, secondIntake] = getStocksData(database, NOW).intakes;
    archiveIntake(database, secondIntake.id);
    for (const expectedIntakeAt of ["2026-10-18T08:20", "2026-10-19T08:20"]) {
      database
        .insert(intakeLogTable)
        .values({
          intakeId: firstIntake.id,
          expectedIntakeAt,
          createdAt: expectedIntakeAt,
          status: "taken",
        })
        .run();
    }

    const data = getStocksData(database, NOW);

    expect(data.localDate).toBe("2026-10-19");
    expect(data.medStocks.map(({ med }) => med.name)).toContain("Quviviq");
    expect(data.intakes.map(({ id }) => id)).not.toContain(secondIntake.id);
    expect(data.intakeLogs.map(({ expectedIntakeAt }) => expectedIntakeAt)).toEqual([
      "2026-10-19T08:20",
    ]);
  });
});
