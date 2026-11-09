import { sql } from "drizzle-orm";

import type { NotificationSound } from "@/domain/sound";
import { intakeTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

export function setAllActiveIntakesSound(database: Database, sound: NotificationSound): void {
  database
    .update(intakeTable)
    .set({ sound })
    .where(sql`${intakeTable.isArchived} = 0`)
    .run();
}
