import { sql } from "drizzle-orm";

import type { Intake } from "@/domain/intake";
import { intakeTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

import { selectActiveIntakes } from "./intakeRecord";

export function getIntakeById(database: Database, intakeId: string): Intake | undefined {
  const [intake] = selectActiveIntakes(database, sql`${intakeTable.id} = ${intakeId}`);
  return intake;
}
