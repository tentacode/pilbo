import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { DEFAULT_REMINDER_INTERVAL_MINUTES } from "@/domain/intake";
import { synchronousStorage } from "@/shared/storage/synchronousStorage";

const SETTINGS_STORAGE_KEY = "settings";

export const LOW_STOCK_DAYS = { minimum: 1, maximum: 30, default: 7 } as const;

export type AppLanguage = "fr" | "en";

export type AppColorScheme = "light" | "dark";

type SettingsState = {
  defaultReminderIntervalMinutes: number;
  lowStockDays: number;
  language: AppLanguage | null;
  colorScheme: AppColorScheme | null;
  setDefaultReminderIntervalMinutes: (minutes: number) => void;
  setLowStockDays: (days: number) => void;
  setLanguage: (language: AppLanguage) => void;
  setColorScheme: (colorScheme: AppColorScheme) => void;
};

function clampLowStockDays(days: number): number {
  return Math.min(LOW_STOCK_DAYS.maximum, Math.max(LOW_STOCK_DAYS.minimum, days));
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      defaultReminderIntervalMinutes: DEFAULT_REMINDER_INTERVAL_MINUTES,
      lowStockDays: LOW_STOCK_DAYS.default,
      language: null,
      colorScheme: null,
      setDefaultReminderIntervalMinutes: (minutes) =>
        set({ defaultReminderIntervalMinutes: minutes }),
      setLowStockDays: (days) => set({ lowStockDays: clampLowStockDays(days) }),
      setLanguage: (language) => set({ language }),
      setColorScheme: (colorScheme) => set({ colorScheme }),
    }),
    {
      name: SETTINGS_STORAGE_KEY,
      storage: createJSONStorage(() => synchronousStorage),
      partialize: ({ defaultReminderIntervalMinutes, lowStockDays, language, colorScheme }) => ({
        defaultReminderIntervalMinutes,
        lowStockDays,
        language,
        colorScheme,
      }),
    },
  ),
);
