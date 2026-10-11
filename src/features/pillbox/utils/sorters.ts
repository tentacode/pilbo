import type { Intake } from "@/domain/intake";
import type { Med } from "@/domain/med";

const LOCALE = "fr";

function compareText(first: string, second: string): number {
  return first.localeCompare(second, LOCALE, { numeric: true, sensitivity: "base" });
}

export function compareMeds(first: Med, second: Med): number {
  return compareText(first.name, second.name) || compareText(first.strength, second.strength);
}

export function sortMeds(meds: Med[]): Med[] {
  return [...meds].sort(compareMeds);
}

export function sortIntakeMeds(intake: Intake): Intake {
  return {
    ...intake,
    medQuantities: [...intake.medQuantities].sort((first, second) =>
      compareMeds(first.med, second.med),
    ),
  };
}
