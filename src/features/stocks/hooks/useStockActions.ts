import type { Stock } from "@/domain/stock";
import { database } from "@/shared/database/database";

import { rescheduleAfterChange } from "@/features/pillbox/hooks/useIntakeActions";
import { deleteStock } from "@/features/stocks/queries/deleteStock";
import { saveStock } from "@/features/stocks/queries/saveStock";

export function useStockActions() {
  return {
    save: (stock: Stock) => {
      saveStock(database, stock);
      rescheduleAfterChange();
    },
    remove: (medId: string) => {
      deleteStock(database, medId);
      rescheduleAfterChange();
    },
  };
}
