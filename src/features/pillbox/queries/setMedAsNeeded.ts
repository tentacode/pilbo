import { sql } from "drizzle-orm";

import { medTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

export function setMedAsNeeded(database: Database, medId: string, isAsNeeded: boolean): void {
  database
    .update(medTable)
    .set({ isAsNeeded })
    .where(sql`${medTable.id} = ${medId}`)
    .run();
}
