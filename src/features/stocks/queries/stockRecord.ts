import { type SQL, sql } from "drizzle-orm";

import type { MedStock } from "@/domain/stock";
import { medTable, stockTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

import { type MedRecord, toMed } from "@/features/pillbox/queries/medRecord";

type MedStockRecord = MedRecord & {
  quantity: number;
  boxSize: number;
  lowStockDays: number;
};

export function selectMedStocks(database: Database, condition: SQL = sql`1 = 1`): MedStock[] {
  const records = database.all<MedStockRecord>(sql`
    SELECT
      ${medTable.id} AS id,
      ${medTable.name} AS name,
      ${medTable.strength} AS strength,
      ${medTable.detail} AS detail,
      ${medTable.design} AS design,
      ${medTable.isAsNeeded} AS isAsNeeded,
      ${stockTable.quantity} AS quantity,
      ${stockTable.boxSize} AS boxSize,
      ${stockTable.lowStockDays} AS lowStockDays
    FROM ${stockTable}
    INNER JOIN ${medTable} ON ${medTable.id} = ${stockTable.medId}
    WHERE ${condition}
  `);
  return records.map(({ quantity, boxSize, lowStockDays, ...medRecord }) => ({
    med: toMed(medRecord),
    stock: { medId: medRecord.id, quantity, boxSize, lowStockDays },
  }));
}
