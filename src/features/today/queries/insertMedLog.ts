import { toLocalDateTime } from "@/domain/intakeLog";
import { medLogTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

export function insertMedLog(database: Database, medId: string, now: Date): string {
  const { id } = database
    .insert(medLogTable)
    .values({ medId, takenAt: toLocalDateTime(now) })
    .returning({ id: medLogTable.id })
    .get();
  return id;
}
