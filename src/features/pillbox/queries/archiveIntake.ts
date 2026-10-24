import { sql } from "drizzle-orm";

import { toLocalDate } from "@/domain/intakeLog";
import { intakeTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

export function archiveIntake(database: Database, intakeId: string, today: Date): void {
  database
    .update(intakeTable)
    .set({ isArchived: true, archivedOn: toLocalDate(today) })
    .where(sql`${intakeTable.id} = ${intakeId}`)
    .run();
}
