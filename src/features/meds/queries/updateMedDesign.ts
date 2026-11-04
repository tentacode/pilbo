import { sql } from "drizzle-orm";

import type { PillDesign } from "@/domain/med";
import { medTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

export function updateMedDesign(database: Database, medId: string, design: PillDesign): void {
  database
    .update(medTable)
    .set({ design })
    .where(sql`${medTable.id} = ${medId}`)
    .run();
}
