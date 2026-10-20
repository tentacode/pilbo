import { toLocalDateTime } from "@/domain/intakeLog";
import { medLogTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

export function insertMedLog(database: Database, medId: string, now: Date): void {
  database
    .insert(medLogTable)
    .values({ medId, takenAt: toLocalDateTime(now) })
    .run();
}
