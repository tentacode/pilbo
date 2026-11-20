import type { Intake } from "@/domain/intake";

export function scheduledIntakesOf(medId: string, intakes: Intake[]): Intake[] {
  return intakes.filter(
    ({ frequency, days, medQuantities }) =>
      (frequency === "monthly" || days.length > 0) &&
      medQuantities.some(({ med }) => med.id === medId),
  );
}
