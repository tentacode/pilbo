import { type SQL, sql } from "drizzle-orm";

import type { Med, PillDesign } from "@/domain/med";
import { medTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

export type MedRecord = {
  id: string;
  name: string;
  strength: string;
  detail: string;
  design: string;
  isAsNeeded: number;
};

type StoredPillDesign = Omit<PillDesign, "colors"> & { colors: [string] | [string, string] };

function toPillDesign(json: string): PillDesign {
  const design = JSON.parse(json) as StoredPillDesign;
  const [firstColor, secondColor = firstColor] = design.colors;
  return { ...design, colors: [firstColor, secondColor] };
}

export function toMed(record: MedRecord): Med {
  return {
    id: record.id,
    name: record.name,
    strength: record.strength,
    detail: record.detail,
    design: toPillDesign(record.design),
    isAsNeeded: record.isAsNeeded === 1,
  };
}

export function selectMeds(database: Database, condition: SQL = sql`1 = 1`): Med[] {
  const records = database.all<MedRecord>(sql`
    SELECT
      ${medTable.id} AS id,
      ${medTable.name} AS name,
      ${medTable.strength} AS strength,
      ${medTable.detail} AS detail,
      ${medTable.design} AS design,
      ${medTable.isAsNeeded} AS isAsNeeded
    FROM ${medTable}
    WHERE ${condition}
  `);
  return records.map(toMed);
}
