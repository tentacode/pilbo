import type { Med } from "@/domain/med";
import type { Database } from "@/shared/database/types";

import { selectMeds } from "./medRecord";

export function getAllMeds(database: Database): Med[] {
  return selectMeds(database);
}
