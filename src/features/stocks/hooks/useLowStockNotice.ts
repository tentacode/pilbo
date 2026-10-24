import { useEffect } from "react";

import { useLowStockNoticeStore } from "@/features/stocks/store/lowStockNoticeStore";
import {
  isLowStockNoticeVisible,
  keepLowStockMedIds,
} from "@/features/stocks/utils/lowStockNotice";
import { useLowStockMedIds } from "./useLowStockMedIds";

export function useLowStockNotice() {
  const lowStockMedIds = useLowStockMedIds();
  const dismissedMedIds = useLowStockNoticeStore((state) => state.dismissedMedIds);
  const setDismissedMedIds = useLowStockNoticeStore((state) => state.setDismissedMedIds);

  useEffect(() => {
    const keptMedIds = keepLowStockMedIds(dismissedMedIds, lowStockMedIds);
    if (keptMedIds.length !== dismissedMedIds.length) {
      setDismissedMedIds(keptMedIds);
    }
  }, [lowStockMedIds, dismissedMedIds, setDismissedMedIds]);

  return {
    isVisible: isLowStockNoticeVisible(lowStockMedIds, dismissedMedIds),
    lowStockCount: lowStockMedIds.length,
    dismiss: () => setDismissedMedIds(lowStockMedIds),
  };
}
