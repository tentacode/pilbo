import type { MedStock } from "@/domain/stock";
import type { Database } from "@/shared/database/types";

import { selectMedStocks } from "./stockRecord";

export function getAllStocks(database: Database): MedStock[] {
  return selectMedStocks(database);
}
