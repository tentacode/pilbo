import { sql } from "drizzle-orm";

import type { Med } from "@/domain/med";
import { medTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

import { selectMeds } from "./medRecord";

type DuplicateSearch = {
  name: string;
  strength: string;
  excludedMedId?: string;
};

export function findDuplicateMed(
  database: Database,
  { name, strength, excludedMedId }: DuplicateSearch,
): Med | undefined {
  const [duplicate] = selectMeds(
    database,
    sql`${medTable.name} = ${name.trim()}
      AND ${medTable.strength} = ${strength.trim()}
      AND ${medTable.id} != ${excludedMedId ?? ""}`,
  );
  return duplicate;
}
