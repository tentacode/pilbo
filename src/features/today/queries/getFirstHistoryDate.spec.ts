import { createTestDatabase } from "@/shared/database/testDatabase";

import { getAllIntakes } from "@/features/pillbox/queries/getAllIntakes";
import { getAsNeededMeds } from "@/features/pillbox/queries/getAsNeededMeds";
import { getFirstHistoryDate } from "./getFirstHistoryDate";
import { insertIntakeLog } from "./insertIntakeLog";
import { insertMedLog } from "./insertMedLog";

describe("getFirstHistoryDate", () => {
  it("returns the creation date of the oldest intake", () => {
    const database = createTestDatabase({ now: new Date(2026, 9, 24, 9, 0) });

    expect(getFirstHistoryDate(database)).toBe("2026-09-09");
  });

  it("returns the date of an older intake log", () => {
    const database = createTestDatabase({ now: new Date(2026, 9, 24, 9, 0) });
    const [morning] = getAllIntakes(database);
    insertIntakeLog(database, {
      intakeId: morning.id,
      expectedIntakeAt: "2026-09-01T08:20",
      createdAt: "2026-09-01T08:25",
      status: "taken",
    });

    expect(getFirstHistoryDate(database)).toBe("2026-09-01");
  });

  it("returns the date of an older as-needed log", () => {
    const database = createTestDatabase({ now: new Date(2026, 9, 24, 9, 0) });
    const [prazepam] = getAsNeededMeds(database);
    insertMedLog(database, prazepam.id, new Date(2026, 7, 30, 15, 40));

    expect(getFirstHistoryDate(database)).toBe("2026-08-30");
  });

  it("returns null without any intake nor log", () => {
    expect(getFirstHistoryDate(createTestDatabase({ seed: false }))).toBeNull();
  });
});
