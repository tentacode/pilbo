import type { IntakeLog } from "@/domain/intakeLog";
import { intakeLogTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

export function insertIntakeLog(database: Database, intakeLog: Omit<IntakeLog, "id">): void {
  database.insert(intakeLogTable).values(intakeLog).run();
}
