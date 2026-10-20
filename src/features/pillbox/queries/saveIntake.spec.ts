import { intakeMedTable, intakeTable } from "@/shared/database/schema";
import { createTestDatabase } from "@/shared/database/testDatabase";
import { countRows } from "@/shared/database/testHelpers";

import { getAllIntakes } from "./getAllIntakes";
import { getAsNeededMeds } from "./getAsNeededMeds";
import { getIntakeById } from "./getIntakeById";
import { saveIntake } from "./saveIntake";

describe("saveIntake", () => {
  it("inserts a new intake with its meds", () => {
    const database = createTestDatabase();
    const [prazepam] = getAsNeededMeds(database);

    const intakeId = saveIntake(database, {
      time: { hour: 7, minute: 45 },
      days: ["monday", "friday"],
      reminderIntervalMinutes: 15,
      medQuantities: [{ medId: prazepam.id, quantity: 2 }],
    });

    expect(getIntakeById(database, intakeId)).toEqual({
      id: intakeId,
      time: { hour: 7, minute: 45 },
      days: ["monday", "friday"],
      reminderIntervalMinutes: 15,
      medQuantities: [{ med: prazepam, quantity: 2 }],
    });
    expect(countRows(database, intakeTable)).toBe(5);
  });

  it("updates an existing intake in place and replaces its meds", () => {
    const database = createTestDatabase();
    const [morning] = getAllIntakes(database);
    const [prazepam] = getAsNeededMeds(database);
    const linksBefore = countRows(database, intakeMedTable);

    const intakeId = saveIntake(database, {
      id: morning.id,
      time: { hour: 9, minute: 0 },
      days: ["sunday"],
      reminderIntervalMinutes: 30,
      medQuantities: [{ medId: prazepam.id, quantity: 3 }],
    });

    expect(intakeId).toBe(morning.id);
    expect(getIntakeById(database, morning.id)).toEqual({
      id: morning.id,
      time: { hour: 9, minute: 0 },
      days: ["sunday"],
      reminderIntervalMinutes: 30,
      medQuantities: [{ med: prazepam, quantity: 3 }],
    });
    expect(countRows(database, intakeTable)).toBe(4);
    expect(countRows(database, intakeMedTable)).toBe(
      linksBefore - morning.medQuantities.length + 1,
    );
  });
});
