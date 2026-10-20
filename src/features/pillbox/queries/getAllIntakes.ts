import type { Intake } from "@/domain/intake";
import type { Database } from "@/shared/database/types";

import { selectActiveIntakes } from "./intakeRecord";

export function getAllIntakes(database: Database): Intake[] {
  return selectActiveIntakes(database);
}
