import Storage from "expo-sqlite/kv-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const ONBOARDING_STORAGE_KEY = "onboarding";

type OnboardingState = {
  onboardingDone: boolean;
  setOnboardingDone: (value: boolean) => void;
};

// Sync methods: the store is hydrated before the first render, no onboarding flash.
const synchronousStorage = {
  getItem: (key: string) => Storage.getItemSync(key),
  setItem: (key: string, value: string) => Storage.setItemSync(key, value),
  removeItem: (key: string) => {
    Storage.removeItemSync(key);
  },
};

export function isFirstLaunch(): boolean {
  return Storage.getItemSync(ONBOARDING_STORAGE_KEY) === null;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      onboardingDone: false,
      setOnboardingDone: (value) => set({ onboardingDone: value }),
    }),
    {
      name: ONBOARDING_STORAGE_KEY,
      storage: createJSONStorage(() => synchronousStorage),
      partialize: ({ onboardingDone }) => ({ onboardingDone }),
    },
  ),
);
