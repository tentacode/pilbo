import { sql } from "drizzle-orm";

import type { Intake } from "@/domain/intake";
import { toLocalDate } from "@/domain/intakeLog";
import { medTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

import { deleteStock } from "@/features/stocks/queries/deleteStock";
import { getActiveIntakesOfMed } from "./getActiveIntakesOfMed";

export type MedArchiveResult = { status: "archived" } | { status: "inIntakes"; intakes: Intake[] };

export function archiveMed(database: Database, medId: string, now: Date): MedArchiveResult {
  return database.transaction((transaction) => {
    const intakes = getActiveIntakesOfMed(transaction, medId);
    if (intakes.length > 0) {
      return { status: "inIntakes", intakes };
    }
    deleteStock(transaction, medId);
    transaction
      .update(medTable)
      .set({ archivedOn: toLocalDate(now) })
      .where(sql`${medTable.id} = ${medId}`)
      .run();
    return { status: "archived" };
  });
}
