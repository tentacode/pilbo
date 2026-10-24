import { sql } from "drizzle-orm";

import { stockTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

export type StockDecrease = {
  medId: string;
  quantity: number;
};

function getStockQuantity(database: Database, medId: string): number | undefined {
  return database.get<{ quantity: number } | undefined>(sql`
    SELECT ${stockTable.quantity} AS quantity
    FROM ${stockTable}
    WHERE ${stockTable.medId} = ${medId}
  `)?.quantity;
}

export function decreaseStocks(database: Database, decreases: StockDecrease[]): string[] {
  const medIdsBelowZero: string[] = [];
  for (const { medId, quantity } of decreases) {
    const previousQuantity = getStockQuantity(database, medId);
    if (previousQuantity === undefined) {
      continue;
    }
    database
      .update(stockTable)
      .set({ quantity: previousQuantity - quantity })
      .where(sql`${stockTable.medId} = ${medId}`)
      .run();
    if (previousQuantity >= 0 && previousQuantity - quantity < 0) {
      medIdsBelowZero.push(medId);
    }
  }
  return medIdsBelowZero;
}
