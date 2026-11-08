import { create } from "zustand";

export type ResettableTab = "today" | "meds";

type TabResetState = {
  requestCounts: Record<ResettableTab, number>;
  requestTabReset: (tab: ResettableTab) => void;
};

export const useTabResetStore = create<TabResetState>()((set) => ({
  requestCounts: { today: 0, meds: 0 },
  requestTabReset: (tab) =>
    set(({ requestCounts }) => ({
      requestCounts: { ...requestCounts, [tab]: requestCounts[tab] + 1 },
    })),
}));
