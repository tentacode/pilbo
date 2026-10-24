import { useState } from "react";

import { database } from "@/shared/database/database";

import { getStockByMedId } from "@/features/stocks/queries/getStockByMedId";

export function useHasStock(medId: string | undefined): boolean {
  const [hasStock] = useState(
    () => medId !== undefined && getStockByMedId(database, medId) !== undefined,
  );
  return hasStock;
}
