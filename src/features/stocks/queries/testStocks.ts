import type { Database } from "@/shared/database/types";

import { getAllMeds } from "@/features/pillbox/queries/getAllMeds";

export function findMedId(database: Database, name: string, strength: string): string {
  const med = getAllMeds(database).find(
    (candidate) => candidate.name === name && candidate.strength === strength,
  );
  if (!med) {
    throw new Error(`Unknown med ${name} ${strength}`);
  }
  return med.id;
}
