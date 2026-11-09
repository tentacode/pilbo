import { sql } from "drizzle-orm";

import type { NotificationSound } from "@/domain/sound";
import { intakeTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

export function hasActiveIntakeWithOtherSound(
  database: Database,
  sound: NotificationSound,
): boolean {
  const { count } = database.get<{ count: number }>(sql`
    SELECT COUNT(*) AS count
    FROM ${intakeTable}
    WHERE ${intakeTable.isArchived} = 0 AND ${intakeTable.sound} != ${sound}
  `);
  return count > 0;
}
