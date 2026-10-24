import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { synchronousStorage } from "@/shared/storage/synchronousStorage";

const LOW_STOCK_NOTICE_STORAGE_KEY = "lowStockNotice";

type LowStockNoticeState = {
  dismissedMedIds: string[];
  setDismissedMedIds: (medIds: string[]) => void;
};

export const useLowStockNoticeStore = create<LowStockNoticeState>()(
  persist(
    (set) => ({
      dismissedMedIds: [],
      setDismissedMedIds: (medIds) => set({ dismissedMedIds: medIds }),
    }),
    {
      name: LOW_STOCK_NOTICE_STORAGE_KEY,
      storage: createJSONStorage(() => synchronousStorage),
      partialize: ({ dismissedMedIds }) => ({ dismissedMedIds }),
    },
  ),
);
