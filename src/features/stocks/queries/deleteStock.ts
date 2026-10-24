import { sql } from "drizzle-orm";

import { stockTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

export function deleteStock(database: Database, medId: string): void {
  database
    .delete(stockTable)
    .where(sql`${stockTable.medId} = ${medId}`)
    .run();
}
