import type { Intake } from "@/domain/intake";
import { fromLocalDate, type IntakeLog } from "@/domain/intakeLog";
import { createTestDatabase } from "@/shared/database/testDatabase";
import type { Database } from "@/shared/database/types";

import { getStockByMedId } from "@/features/stocks/queries/getStockByMedId";
import { saveStock } from "@/features/stocks/queries/saveStock";
import { getIntakeLogsOfDay } from "./getIntakeLogsOfDay";
import { getIntakesOfDay } from "./getIntakesOfDay";
import { type EditedIntakeStatus, saveIntakeLogChange } from "./saveIntakeLogChange";

const LOCAL_DATE = "2026-10-14";
const INITIAL_STOCK = 20;

function setup() {
  const database = createTestDatabase();
  const intake = getIntakesOfDay(database, fromLocalDate(LOCAL_DATE))[0];
  const med = intake.medQuantities[0];
  saveStock(database, { medId: med.med.id, quantity: INITIAL_STOCK, boxSize: 30, lowStockDays: 7 });
  return { database, intake, medId: med.med.id, quantity: med.quantity };
}

function change(
  database: Database,
  intake: Intake,
  status: EditedIntakeStatus,
  takenTime = { hour: 9, minute: 30 },
): IntakeLog | undefined {
  saveIntakeLogChange(database, {
    intake,
    localDate: LOCAL_DATE,
    previousLog: getIntakeLogsOfDay(database, LOCAL_DATE)[0],
    status,
    takenTime,
  });
  return getIntakeLogsOfDay(database, LOCAL_DATE)[0];
}

function stockOf(database: Database, medId: string): number | undefined {
  return getStockByMedId(database, medId)?.stock.quantity;
}

function expectedIntakeAtOf(intake: Intake): string {
  const { hour, minute } = intake.time;
  return `${LOCAL_DATE}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

describe("saveIntakeLogChange", () => {
  it("logs a missed intake as taken at the chosen time and decreases the stock", () => {
    const { database, intake, medId, quantity } = setup();

    expect(change(database, intake, "taken")).toEqual({
      id: expect.any(String),
      intakeId: intake.id,
      expectedIntakeAt: expectedIntakeAtOf(intake),
      createdAt: `${LOCAL_DATE}T09:30`,
      status: "taken",
    });
    expect(stockOf(database, medId)).toBe(INITIAL_STOCK - quantity);
  });

  it("logs a missed intake as skipped at the scheduled time without touching the stock", () => {
    const { database, intake, medId } = setup();

    expect(change(database, intake, "skipped")).toMatchObject({
      createdAt: expectedIntakeAtOf(intake),
      status: "skipped",
    });
    expect(stockOf(database, medId)).toBe(INITIAL_STOCK);
  });

  it("gives the pills back when a taken intake becomes skipped, keeping its time", () => {
    const { database, intake, medId } = setup();
    change(database, intake, "taken");

    expect(change(database, intake, "skipped")).toMatchObject({
      createdAt: `${LOCAL_DATE}T09:30`,
      status: "skipped",
    });
    expect(stockOf(database, medId)).toBe(INITIAL_STOCK);
  });

  it("takes the pills when a skipped intake becomes taken", () => {
    const { database, intake, medId, quantity } = setup();
    change(database, intake, "skipped");

    expect(change(database, intake, "taken", { hour: 10, minute: 5 })).toMatchObject({
      createdAt: `${LOCAL_DATE}T10:05`,
      status: "taken",
    });
    expect(stockOf(database, medId)).toBe(INITIAL_STOCK - quantity);
  });

  it("changes only the time of a taken intake", () => {
    const { database, intake, medId, quantity } = setup();
    change(database, intake, "taken");

    expect(change(database, intake, "taken", { hour: 11, minute: 0 })).toMatchObject({
      createdAt: `${LOCAL_DATE}T11:00`,
    });
    expect(getIntakeLogsOfDay(database, LOCAL_DATE)).toHaveLength(1);
    expect(stockOf(database, medId)).toBe(INITIAL_STOCK - quantity);
  });

  it("deletes the log of a taken intake and gives the pills back", () => {
    const { database, intake, medId } = setup();
    change(database, intake, "taken");

    expect(change(database, intake, "none")).toBeUndefined();
    expect(stockOf(database, medId)).toBe(INITIAL_STOCK);
  });

  it("deletes the log of a skipped intake without touching the stock", () => {
    const { database, intake, medId } = setup();
    change(database, intake, "skipped");

    expect(change(database, intake, "none")).toBeUndefined();
    expect(stockOf(database, medId)).toBe(INITIAL_STOCK);
  });
});
