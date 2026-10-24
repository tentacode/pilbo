import { sql } from "drizzle-orm";

import type { Intake } from "@/domain/intake";
import { intakeLogTable, intakeMedTable, intakeTable } from "@/shared/database/schema";
import { createTestDatabase } from "@/shared/database/testDatabase";
import { countRows } from "@/shared/database/testHelpers";
import type { Database } from "@/shared/database/types";

import { insertIntakeLog } from "@/features/today/queries/insertIntakeLog";
import { getAllIntakes } from "./getAllIntakes";
import { getAsNeededMeds } from "./getAsNeededMeds";
import { getIntakeById } from "./getIntakeById";
import { type IntakeToSave, saveIntake } from "./saveIntake";

const TODAY = new Date(2026, 9, 24, 9, 0);

type IntakeVersionRecord = {
  createdOn: string;
  archivedOn: string | null;
  isArchived: number;
};

function readVersion(database: Database, intakeId: string): IntakeVersionRecord {
  return database.get<IntakeVersionRecord>(sql`
    SELECT
      ${intakeTable.createdOn} AS createdOn,
      ${intakeTable.archivedOn} AS archivedOn,
      ${intakeTable.isArchived} AS isArchived
    FROM ${intakeTable}
    WHERE ${intakeTable.id} = ${intakeId}
  `);
}

function readLogIntakeIds(database: Database): Record<string, string> {
  const records = database.all<{ expectedIntakeAt: string; intakeId: string }>(sql`
    SELECT
      ${intakeLogTable.expectedIntakeAt} AS expectedIntakeAt,
      ${intakeLogTable.intakeId} AS intakeId
    FROM ${intakeLogTable}
  `);
  return Object.fromEntries(
    records.map(({ expectedIntakeAt, intakeId }) => [expectedIntakeAt, intakeId]),
  );
}

function toIntakeToSave(intake: Intake, changes: Partial<IntakeToSave> = {}): IntakeToSave {
  return {
    id: intake.id,
    time: intake.time,
    days: intake.days,
    reminderIntervalMinutes: intake.reminderIntervalMinutes,
    medQuantities: intake.medQuantities.map(({ med, quantity }) => ({ medId: med.id, quantity })),
    ...changes,
  };
}

function logMorningOn(database: Database, morning: Intake, localDate: string): void {
  insertIntakeLog(database, {
    intakeId: morning.id,
    expectedIntakeAt: `${localDate}T08:20`,
    createdAt: `${localDate}T08:25`,
    status: "taken",
  });
}

describe("saveIntake", () => {
  it("inserts a new intake with its meds, created today", () => {
    const database = createTestDatabase();
    const [prazepam] = getAsNeededMeds(database);

    const intakeId = saveIntake(
      database,
      {
        time: { hour: 7, minute: 45 },
        days: ["monday", "friday"],
        reminderIntervalMinutes: 15,
        medQuantities: [{ medId: prazepam.id, quantity: 2 }],
      },
      TODAY,
    );

    expect(getIntakeById(database, intakeId)).toEqual({
      id: intakeId,
      time: { hour: 7, minute: 45 },
      days: ["monday", "friday"],
      reminderIntervalMinutes: 15,
      medQuantities: [{ med: prazepam, quantity: 2 }],
    });
    expect(readVersion(database, intakeId)).toEqual({
      createdOn: "2026-10-24",
      archivedOn: null,
      isArchived: 0,
    });
    expect(countRows(database, intakeTable)).toBe(5);
  });

  it("updates an intake without past logs in place and replaces its meds", () => {
    const database = createTestDatabase();
    const [morning] = getAllIntakes(database);
    const [prazepam] = getAsNeededMeds(database);
    const linksBefore = countRows(database, intakeMedTable);
    logMorningOn(database, morning, "2026-10-24");

    const intakeId = saveIntake(
      database,
      {
        id: morning.id,
        time: { hour: 9, minute: 0 },
        days: ["sunday"],
        reminderIntervalMinutes: 30,
        medQuantities: [{ medId: prazepam.id, quantity: 3 }],
      },
      TODAY,
    );

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

  it("creates a new version when an intake with past logs changes", () => {
    const database = createTestDatabase();
    const [morning] = getAllIntakes(database);
    logMorningOn(database, morning, "2026-10-23");
    logMorningOn(database, morning, "2026-10-24");

    const intakeId = saveIntake(
      database,
      toIntakeToSave(morning, { time: { hour: 9, minute: 0 } }),
      TODAY,
    );

    expect(intakeId).not.toBe(morning.id);
    expect(getIntakeById(database, morning.id)).toBeUndefined();
    expect(getIntakeById(database, intakeId)).toEqual({
      ...morning,
      id: intakeId,
      time: { hour: 9, minute: 0 },
    });
    expect(readVersion(database, morning.id)).toEqual({
      createdOn: "2025-11-17",
      archivedOn: "2026-10-24",
      isArchived: 1,
    });
    expect(readVersion(database, intakeId)).toEqual({
      createdOn: "2026-10-24",
      archivedOn: null,
      isArchived: 0,
    });
    expect(readLogIntakeIds(database)).toEqual({
      "2026-10-23T08:20": morning.id,
      "2026-10-24T08:20": intakeId,
    });
    expect(countRows(database, intakeTable)).toBe(5);
  });

  it.each<[string, (morning: Intake) => Partial<IntakeToSave>]>([
    ["the days", () => ({ days: ["monday"] })],
    [
      "a quantity",
      (morning) => ({ medQuantities: [{ medId: morning.medQuantities[0].med.id, quantity: 2 }] }),
    ],
  ])("creates a new version when %s change", (_change, changes) => {
    const database = createTestDatabase();
    const [morning] = getAllIntakes(database);
    logMorningOn(database, morning, "2026-10-23");

    const intakeId = saveIntake(database, toIntakeToSave(morning, changes(morning)), TODAY);

    expect(intakeId).not.toBe(morning.id);
  });

  it("updates in place when only the reminder interval changes", () => {
    const database = createTestDatabase();
    const [morning] = getAllIntakes(database);
    logMorningOn(database, morning, "2026-10-23");

    const intakeId = saveIntake(
      database,
      toIntakeToSave(morning, {
        reminderIntervalMinutes: 30,
        days: [...morning.days].reverse(),
        medQuantities: toIntakeToSave(morning).medQuantities.reverse(),
      }),
      TODAY,
    );

    expect(intakeId).toBe(morning.id);
    expect(getIntakeById(database, morning.id)?.reminderIntervalMinutes).toBe(30);
    expect(countRows(database, intakeTable)).toBe(4);
  });
});
