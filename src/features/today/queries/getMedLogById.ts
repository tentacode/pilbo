import { sql } from "drizzle-orm";

import { medLogTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

import type { MedLogOfDay } from "@/features/today/utils/todayTypes";
import { selectMedLogs } from "./getMedLogsOfDay";

export function getMedLogById(database: Database, medLogId: string): MedLogOfDay | undefined {
  const [medLog] = selectMedLogs(database, sql`${medLogTable.id} = ${medLogId}`);
  return medLog;
}
