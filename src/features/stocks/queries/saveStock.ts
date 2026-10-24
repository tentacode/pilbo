import type { Stock } from "@/domain/stock";
import { stockTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

export function saveStock(database: Database, { medId, ...values }: Stock): void {
  database
    .insert(stockTable)
    .values({ medId, ...values })
    .onConflictDoUpdate({ target: stockTable.medId, set: values })
    .run();
}
