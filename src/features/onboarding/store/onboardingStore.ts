import Storage from "expo-sqlite/kv-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { synchronousStorage } from "@/shared/storage/synchronousStorage";

const ONBOARDING_STORAGE_KEY = "onboarding";

type OnboardingState = {
  onboardingDone: boolean;
  isRestartedFromSettings: boolean;
  setOnboardingDone: (value: boolean) => void;
  restartOnboarding: () => void;
};

export function isFirstLaunch(): boolean {
  return Storage.getItemSync(ONBOARDING_STORAGE_KEY) === null;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      onboardingDone: false,
      isRestartedFromSettings: false,
      setOnboardingDone: (value) => set({ onboardingDone: value, isRestartedFromSettings: false }),
      restartOnboarding: () => set({ onboardingDone: false, isRestartedFromSettings: true }),
    }),
    {
      name: ONBOARDING_STORAGE_KEY,
      storage: createJSONStorage(() => synchronousStorage),
      partialize: ({ onboardingDone, isRestartedFromSettings }) => ({
        onboardingDone,
        isRestartedFromSettings,
      }),
    },
  ),
);
