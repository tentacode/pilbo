import type { Intake } from "@/domain/intake";
import { addDays, type IntakeLog, toLocalDate } from "@/domain/intakeLog";
import { isIntakeDueOn } from "@/domain/recurrence";
import type { Stock } from "@/domain/stock";

export type StockStatus = "low" | "sufficient" | "noSchedule";

export type StockForecast = {
  status: StockStatus;
  daysLeft?: number;
  lastCoveredDate?: Date;
  lowStockDate?: Date;
};

const DAYS_PER_WEEK = 7;
const MAXIMUM_SIMULATED_DAYS = 9999;
const STOCK_BAR_HORIZON_DAYS = 30;
const NO_HANDLED_INTAKE: ReadonlySet<string> = new Set();

function dosesOn(
  day: Date,
  medId: string,
  intakes: Intake[],
  handledIntakeIds: ReadonlySet<string>,
) {
  return intakes
    .filter((intake) => isIntakeDueOn(intake, day) && !handledIntakeIds.has(intake.id))
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

function greatestCommonDivisor(first: number, second: number): number {
  return second === 0 ? first : greatestCommonDivisor(second, first % second);
}

function repeatingPeriodDays(intakes: Intake[]): number | null {
  if (intakes.some(({ frequency }) => frequency === "monthly")) {
    return null;
  }
  return intakes.reduce((period, { frequency, interval }) => {
    const intakePeriod = frequency === "weekly" ? DAYS_PER_WEEK * interval : DAYS_PER_WEEK;
    return (period * intakePeriod) / greatestCommonDivisor(period, intakePeriod);
  }, DAYS_PER_WEEK);
}

function periodConsumption(medId: string, intakes: Intake[], from: Date, period: number): number {
  return sum(
    Array.from({ length: period }, (_, day) =>
      sum(dosesOn(addDays(from, day), medId, intakes, NO_HANDLED_INTAKE)),
    ),
  );
}

function intakesOfMed(medId: string, intakes: Intake[]): Intake[] {
  return intakes.filter(({ medQuantities }) => medQuantities.some(({ med }) => med.id === medId));
}

function latestStartsOn(intakes: Intake[]): string {
  return intakes.reduce((latest, { startsOn }) => (startsOn > latest ? startsOn : latest), "");
}

function handledIntakeIdsOf(todayIntakeLogs: IntakeLog[]): Set<string> {
  return new Set(todayIntakeLogs.map(({ intakeId }) => intakeId));
}

export function isScheduled(medId: string, intakes: Intake[]): boolean {
  return intakesOfMed(medId, intakes).some(
    ({ frequency, days }) => frequency === "monthly" || days.length > 0,
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
  const medIntakes = intakesOfMed(medId, intakes);
  const period = repeatingPeriodDays(medIntakes);
  const repeatingFrom = latestStartsOn(medIntakes);
  let hasSkippedPeriods = period === null;
  let remaining = quantity;

  for (let day = 0; day < MAXIMUM_SIMULATED_DAYS; day += 1) {
    const date = addDays(now, day);
    if (!hasSkippedPeriods && period !== null && day > 0 && toLocalDate(date) >= repeatingFrom) {
      hasSkippedPeriods = true;
      const consumption = periodConsumption(medId, medIntakes, date, period);
      if (consumption > 0) {
        // Skipping whole periods keeps the result exact: each one consumes the same quantity.
        const skippedPeriods = Math.max(0, Math.floor(remaining / consumption) - 1);
        remaining -= skippedPeriods * consumption;
        day += skippedPeriods * period;
      }
    }
    const handledIntakeIds = day === 0 ? handledToday : NO_HANDLED_INTAKE;
    for (const dose of dosesOn(addDays(now, day), medId, medIntakes, handledIntakeIds)) {
      if (remaining < dose) {
        return day;
      }
      remaining -= dose;
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

export function stockRatio({ daysLeft }: Pick<StockForecast, "daysLeft">): number | undefined {
  if (daysLeft === undefined) {
    return undefined;
  }
  return Math.min(1, Math.max(0, daysLeft / STOCK_BAR_HORIZON_DAYS));
}
