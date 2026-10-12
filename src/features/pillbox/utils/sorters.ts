import { compareMeds, type Med } from "@/domain/med";

export function sortMeds(meds: Med[]): Med[] {
  return [...meds].sort(compareMeds);
}
