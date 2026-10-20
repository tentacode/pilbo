import { sql } from "drizzle-orm";

import type { Med } from "@/domain/med";
import { medTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

import { selectMeds } from "./medRecord";

export function getMedById(database: Database, medId: string): Med | undefined {
  const [med] = selectMeds(database, sql`${medTable.id} = ${medId}`);
  return med;
}
