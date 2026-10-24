import { sql } from "drizzle-orm";

import { stockTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

export function increaseStock(database: Database, medId: string, quantity: number): void {
  database
    .update(stockTable)
    .set({ quantity: sql`${stockTable.quantity} + ${quantity}` })
    .where(sql`${stockTable.medId} = ${medId}`)
    .run();
}
