import { fromLocalDate } from "@/domain/intakeLog";
import { createTestDatabase } from "@/shared/database/testDatabase";

import { getStockByMedId } from "@/features/stocks/queries/getStockByMedId";
import { saveStock } from "@/features/stocks/queries/saveStock";
import { getIntakeLogsOfDay } from "@/features/today/queries/getIntakeLogsOfDay";
import { getIntakesOfDay } from "@/features/today/queries/getIntakesOfDay";
import { applyReminderAction } from "./applyReminderAction";

const INTAKE_DAY = "2026-10-14";
const NOW = new Date(2026, 9, 14, 9, 30);
const INITIAL_STOCK = 20;

function setup() {
  const database = createTestDatabase();
  const intake = getIntakesOfDay(database, fromLocalDate(INTAKE_DAY))[0];
  const { med, quantity } = intake.medQuantities[0];
  saveStock(database, { medId: med.id, quantity: INITIAL_STOCK, boxSize: 30, lowStockDays: 7 });
  const stockOf = () => getStockByMedId(database, med.id)?.stock.quantity;
  return {
    database,
    reminderIntake: { intakeId: intake.id, intakeDay: INTAKE_DAY },
    quantity,
    stockOf,
  };
}

describe("applyReminderAction", () => {
  it("logs the intake as taken and decreases the stock", () => {
    const { database, reminderIntake, quantity, stockOf } = setup();

    expect(applyReminderAction(database, reminderIntake, "taken", NOW)).toBe(true);

    expect(getIntakeLogsOfDay(database, INTAKE_DAY)).toEqual([
      expect.objectContaining({
        intakeId: reminderIntake.intakeId,
        status: "taken",
        createdAt: "2026-10-14T09:30",
      }),
    ]);
    expect(stockOf()).toBe(INITIAL_STOCK - quantity);
  });

  it("logs the intake as skipped without changing the stock", () => {
    const { database, reminderIntake, stockOf } = setup();

    applyReminderAction(database, reminderIntake, "skipped", NOW);

    expect(getIntakeLogsOfDay(database, INTAKE_DAY)).toEqual([
      expect.objectContaining({ status: "skipped" }),
    ]);
    expect(stockOf()).toBe(INITIAL_STOCK);
  });

  it("logs the intake on its own day after midnight", () => {
    const { database, reminderIntake } = setup();

    applyReminderAction(database, reminderIntake, "taken", new Date(2026, 9, 15, 0, 10));

    expect(getIntakeLogsOfDay(database, INTAKE_DAY)).toHaveLength(1);
  });

  it("ignores an intake that is already logged", () => {
    const { database, reminderIntake, quantity, stockOf } = setup();
    applyReminderAction(database, reminderIntake, "taken", NOW);

    expect(applyReminderAction(database, reminderIntake, "taken", NOW)).toBe(false);

    expect(getIntakeLogsOfDay(database, INTAKE_DAY)).toHaveLength(1);
    expect(stockOf()).toBe(INITIAL_STOCK - quantity);
  });

  it("ignores an unknown intake", () => {
    const { database } = setup();

    expect(
      applyReminderAction(database, { intakeId: "unknown", intakeDay: INTAKE_DAY }, "taken", NOW),
    ).toBe(false);
    expect(getIntakeLogsOfDay(database, INTAKE_DAY)).toEqual([]);
  });
});
