import type { Intake } from "@/domain/intake";
import type { IntakeLog } from "@/domain/intakeLog";
import type { Stock } from "@/domain/stock";

import { weekdayOf } from "@/features/today/utils/computeTodayIntakes";

export type StockStatus = "low" | "sufficient" | "noSchedule";

export type StockForecast = {
  status: StockStatus;
  daysLeft?: number;
  lastCoveredDate?: Date;
  lowStockDate?: Date;
};

const DAYS_PER_WEEK = 7;
const MAXIMUM_SIMULATED_DAYS = 9999;
const NO_HANDLED_INTAKE: ReadonlySet<string> = new Set();

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function dosesOn(
  day: Date,
  medId: string,
  intakes: Intake[],
  handledIntakeIds: ReadonlySet<string>,
) {
  const weekday = weekdayOf(day);
  return intakes
    .filter(({ id, days }) => days.includes(weekday) && !handledIntakeIds.has(id))
    .sort(
      (first, second) =>
        first.time.hour - second.time.hour || first.time.minute - second.time.minute,
    )
    .flatMap(({ medQuantities }) =>
      medQuantities.filter(({ med }) => med.id === medId).map(({ quantity }) => quantity),
    );
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function weeklyConsumption(medId: string, intakes: Intake[], now: Date): number {
  return sum(
    Array.from({ length: DAYS_PER_WEEK }, (_, day) =>
      sum(dosesOn(addDays(now, day), medId, intakes, NO_HANDLED_INTAKE)),
    ),
  );
}

function handledIntakeIdsOf(todayIntakeLogs: IntakeLog[]): Set<string> {
  return new Set(todayIntakeLogs.map(({ intakeId }) => intakeId));
}

export function isScheduled(medId: string, intakes: Intake[]): boolean {
  return intakes.some(
    ({ days, medQuantities }) =>
      days.length > 0 && medQuantities.some(({ med }) => med.id === medId),
  );
}

export function countCoveredDays(
  quantity: number,
  medId: string,
  intakes: Intake[],
  todayIntakeLogs: IntakeLog[],
  now: Date,
): number {
  if (quantity <= 0) {
    return 0;
  }
  const handledToday = handledIntakeIdsOf(todayIntakeLogs);
  const consumptionPerWeek = weeklyConsumption(medId, intakes, now);
  let remaining = quantity;

  for (let day = 0; day < MAXIMUM_SIMULATED_DAYS; day += 1) {
    const handledIntakeIds = day === 0 ? handledToday : NO_HANDLED_INTAKE;
    for (const dose of dosesOn(addDays(now, day), medId, intakes, handledIntakeIds)) {
      if (remaining < dose) {
        return day;
      }
      remaining -= dose;
    }
    if (day === 0 && consumptionPerWeek > 0) {
      // Skipping whole weeks keeps the result exact: each one consumes the same quantity.
      const skippedWeeks = Math.max(0, Math.floor(remaining / consumptionPerWeek) - 1);
      remaining -= skippedWeeks * consumptionPerWeek;
      day += skippedWeeks * DAYS_PER_WEEK;
    }
  }
  return MAXIMUM_SIMULATED_DAYS;
}

export function computeStockForecast(
  stock: Stock,
  intakes: Intake[],
  todayIntakeLogs: IntakeLog[],
  now: Date,
): StockForecast {
  if (!isScheduled(stock.medId, intakes)) {
    return { status: stock.quantity <= 0 ? "low" : "noSchedule" };
  }
  const daysLeft = countCoveredDays(stock.quantity, stock.medId, intakes, todayIntakeLogs, now);
  const isLow = stock.quantity <= 0 || daysLeft <= stock.lowStockDays;
  return {
    status: isLow ? "low" : "sufficient",
    daysLeft,
    lastCoveredDate: addDays(now, daysLeft - 1),
    lowStockDate: stock.quantity > 0 ? addDays(now, daysLeft - stock.lowStockDays) : undefined,
  };
}

export function countConsumedPills(
  medId: string,
  days: number,
  intakes: Intake[],
  todayIntakeLogs: IntakeLog[],
  now: Date,
): number {
  const handledToday = handledIntakeIdsOf(todayIntakeLogs);
  return sum(
    Array.from({ length: days }, (_, day) =>
      sum(dosesOn(addDays(now, day), medId, intakes, day === 0 ? handledToday : NO_HANDLED_INTAKE)),
    ),
  );
}

export function stockRatio({ quantity, boxSize }: Pick<Stock, "quantity" | "boxSize">): number {
  return Math.min(1, Math.max(0, quantity / boxSize));
}
