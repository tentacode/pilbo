import { sql } from "drizzle-orm";

import type { MedStock } from "@/domain/stock";
import { stockTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

import { selectMedStocks } from "./stockRecord";

export function getStockByMedId(database: Database, medId: string): MedStock | undefined {
  const [medStock] = selectMedStocks(database, sql`${stockTable.medId} = ${medId}`);
  return medStock;
}
