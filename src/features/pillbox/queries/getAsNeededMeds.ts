import { sql } from "drizzle-orm";

import type { Med } from "@/domain/med";
import { medTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

import { type MedRecord, toMed } from "./medRecord";

export function getAsNeededMeds(database: Database): Med[] {
  const records = database.all<MedRecord>(sql`
    SELECT
      ${medTable.id} AS id,
      ${medTable.name} AS name,
      ${medTable.strength} AS strength,
      ${medTable.design} AS design,
      ${medTable.isAsNeeded} AS isAsNeeded
    FROM ${medTable}
    WHERE ${medTable.isAsNeeded} = 1
  `);
  return records.map(toMed);
}
