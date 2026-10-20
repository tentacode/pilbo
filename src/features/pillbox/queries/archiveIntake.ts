import { sql } from "drizzle-orm";

import { intakeTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

export function archiveIntake(database: Database, intakeId: string): void {
  database
    .update(intakeTable)
    .set({ isArchived: true })
    .where(sql`${intakeTable.id} = ${intakeId}`)
    .run();
}
