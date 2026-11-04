import { sql } from "drizzle-orm";

import type { Intake } from "@/domain/intake";
import { intakeMedTable, intakeTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

import { selectActiveIntakes } from "@/features/pillbox/queries/intakeRecord";

export function getActiveIntakesOfMed(database: Database, medId: string): Intake[] {
  return selectActiveIntakes(
    database,
    sql`${intakeTable.id} IN (
      SELECT ${intakeMedTable.intakeId} FROM ${intakeMedTable} WHERE ${intakeMedTable.medId} = ${medId}
    )`,
  );
}
