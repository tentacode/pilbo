import { type Intake, WEEKDAYS, type Weekday } from "@/domain/intake";
import type { IntakeLog, IntakeLogStatus } from "@/domain/intakeLog";
import type { Med } from "@/domain/med";
import type { Stock } from "@/domain/stock";

import {
  computeStockForecast,
  countConsumedPills,
  countCoveredDays,
  stockRatio,
} from "./stockForecast";

const MONDAY_MORNING = new Date(2026, 9, 19, 7, 0);

const lithium: Med = {
  id: "lithium",
  name: "Lithium",
  strength: "250 mg",
  detail: "",
  design: { shape: "round", colors: ["#D6C9F5", "#D6C9F5"], size: "medium" },
  isAsNeeded: false,
};

const quviviq: Med = { ...lithium, id: "quviviq", name: "Quviviq" };

function createIntake(
  hour: number,
  quantity: number,
  days: Weekday[] = [...WEEKDAYS],
  med: Med = lithium,
): Intake {
  return {
    id: `intake-${hour}`,
    time: { hour, minute: 0 },
    days,
    reminderIntervalMinutes: 10,
    medQuantities: [{ med, quantity }],
  };
}

function createLog(intake: Intake, status: IntakeLogStatus = "taken"): IntakeLog {
  return {
    id: `log-${intake.id}`,
    intakeId: intake.id,
    expectedIntakeAt: "2026-10-19T08:00",
    createdAt: "2026-10-19T08:00",
    status,
  };
}

function createStock(quantity: number, lowStockDays = 7): Stock {
  return { medId: lithium.id, quantity, boxSize: 30, lowStockDays };
}

const morning = createIntake(8, 1);
const evening = createIntake(20, 1);

describe("countCoveredDays", () => {
  it("returns the fully covered days (spec example)", () => {
    expect(countCoveredDays(5, lithium.id, [morning, evening], [], MONDAY_MORNING)).toBe(2);
  });

  it("ignores the intakes of the day already taken or skipped", () => {
    const logs = [createLog(morning, "skipped")];

    expect(countCoveredDays(5, lithium.id, [morning, evening], logs, MONDAY_MORNING)).toBe(3);
  });

  it("counts a day without dose as covered", () => {
    const mondayAndThursday = createIntake(8, 1, ["monday", "thursday"]);

    expect(countCoveredDays(1, lithium.id, [mondayAndThursday], [], MONDAY_MORNING)).toBe(3);
    expect(countCoveredDays(2, lithium.id, [mondayAndThursday], [], MONDAY_MORNING)).toBe(7);
  });

  it("does not cover a dose larger than the remaining pills", () => {
    const twoPills = createIntake(20, 2);

    expect(countCoveredDays(3, lithium.id, [twoPills], [], MONDAY_MORNING)).toBe(1);
  });

  it("adds the doses of a med in several intakes and ignores the other meds", () => {
    const withQuviviq: Intake = {
      ...evening,
      medQuantities: [...evening.medQuantities, { med: quviviq, quantity: 5 }],
    };

    expect(countCoveredDays(4, lithium.id, [morning, withQuviviq], [], MONDAY_MORNING)).toBe(2);
  });

  it("returns 0 for a stock at zero or below", () => {
    expect(countCoveredDays(0, lithium.id, [morning], [], MONDAY_MORNING)).toBe(0);
    expect(countCoveredDays(-3, lithium.id, [morning], [], MONDAY_MORNING)).toBe(0);
  });

  it("returns 0 when today is not covered", () => {
    expect(countCoveredDays(1, lithium.id, [createIntake(8, 2)], [], MONDAY_MORNING)).toBe(0);
  });

  it("stays exact over many weeks", () => {
    const weekdays = createIntake(8, 1, ["monday", "tuesday", "wednesday", "thursday", "friday"]);

    expect(countCoveredDays(100, lithium.id, [weekdays], [], MONDAY_MORNING)).toBe(140);
    expect(countCoveredDays(102, lithium.id, [weekdays], [], MONDAY_MORNING)).toBe(142);
  });

  it("stops at the simulation bound", () => {
    const sundays = createIntake(8, 1, ["sunday"]);

    expect(countCoveredDays(9999, lithium.id, [sundays], [], MONDAY_MORNING)).toBe(9999);
  });
});

describe("computeStockForecast", () => {
  it("is sufficient above the threshold", () => {
    expect(computeStockForecast(createStock(20), [morning, evening], [], MONDAY_MORNING)).toEqual({
      status: "sufficient",
      daysLeft: 10,
      lastCoveredDate: new Date(2026, 9, 28),
      lowStockDate: new Date(2026, 9, 22),
    });
  });

  it("is low at the threshold", () => {
    expect(computeStockForecast(createStock(14), [morning, evening], [], MONDAY_MORNING)).toEqual({
      status: "low",
      daysLeft: 7,
      lastCoveredDate: new Date(2026, 9, 25),
      lowStockDate: new Date(2026, 9, 19),
    });
  });

  it("is always low at zero or below, without low stock date", () => {
    expect(computeStockForecast(createStock(-1), [morning], [], MONDAY_MORNING)).toEqual({
      status: "low",
      daysLeft: 0,
      lastCoveredDate: new Date(2026, 9, 18),
      lowStockDate: undefined,
    });
  });

  it("has no schedule without active intake", () => {
    expect(computeStockForecast(createStock(10), [], [], MONDAY_MORNING)).toEqual({
      status: "noSchedule",
    });
    expect(
      computeStockForecast(createStock(10), [createIntake(8, 1, [], lithium)], [], MONDAY_MORNING),
    ).toEqual({ status: "noSchedule" });
  });

  it("is low without schedule at zero or below", () => {
    expect(computeStockForecast(createStock(0), [], [], MONDAY_MORNING)).toEqual({
      status: "low",
    });
  });
});

describe("countConsumedPills", () => {
  it("counts the pills of the next days, without the intakes already handled", () => {
    const intakes = [morning, createIntake(20, 2)];

    expect(countConsumedPills(lithium.id, 7, intakes, [], MONDAY_MORNING)).toBe(21);
    expect(countConsumedPills(lithium.id, 7, intakes, [createLog(morning)], MONDAY_MORNING)).toBe(
      20,
    );
  });
});

describe("stockRatio", () => {
  it("divides the stock by the box size, between 0 and 1", () => {
    expect(stockRatio({ quantity: 15, boxSize: 30 })).toBe(0.5);
    expect(stockRatio({ quantity: 45, boxSize: 30 })).toBe(1);
    expect(stockRatio({ quantity: -2, boxSize: 30 })).toBe(0);
  });
});
