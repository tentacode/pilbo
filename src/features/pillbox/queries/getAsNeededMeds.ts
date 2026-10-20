import { sql } from "drizzle-orm";

import type { Med } from "@/domain/med";
import { medTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

import { selectMeds } from "./medRecord";

export function getAsNeededMeds(database: Database): Med[] {
  return selectMeds(database, sql`${medTable.isAsNeeded} = 1`);
}
