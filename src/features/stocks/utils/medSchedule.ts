import { formatIntakeTime, type Intake, WEEKDAYS } from "@/domain/intake";

function intakesWithMed(medId: string, intakes: Intake[]): Intake[] {
  return intakes.filter(
    ({ days, medQuantities }) =>
      days.length > 0 && medQuantities.some(({ med }) => med.id === medId),
  );
}

export function intakeTimesOf(medId: string, intakes: Intake[]): string[] {
  const times = intakesWithMed(medId, intakes).map(({ time }) => formatIntakeTime(time));
  return [...new Set(times)].sort();
}

export function dailyQuantityOf(medId: string, intakes: Intake[]): number | undefined {
  const quantities = WEEKDAYS.map((weekday) =>
    intakesWithMed(medId, intakes)
      .filter(({ days }) => days.includes(weekday))
      .flatMap(({ medQuantities }) => medQuantities.filter(({ med }) => med.id === medId))
      .reduce((total, { quantity }) => total + quantity, 0),
  ).filter((quantity) => quantity > 0);
  const [firstQuantity] = quantities;
  return quantities.every((quantity) => quantity === firstQuantity) ? firstQuantity : undefined;
}
