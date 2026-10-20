import { sql } from "drizzle-orm";

import type { Med } from "@/domain/med";
import { medTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

export type MedToUpdate = Pick<Med, "id" | "name" | "strength" | "detail" | "design">;

export function updateMed(database: Database, { id, ...values }: MedToUpdate): void {
  database
    .update(medTable)
    .set(values)
    .where(sql`${medTable.id} = ${id}`)
    .run();
}
