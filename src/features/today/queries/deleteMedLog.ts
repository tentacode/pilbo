import { sql } from "drizzle-orm";

import { medLogTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

export function deleteMedLog(database: Database, medLogId: string): void {
  database
    .delete(medLogTable)
    .where(sql`${medLogTable.id} = ${medLogId}`)
    .run();
}
