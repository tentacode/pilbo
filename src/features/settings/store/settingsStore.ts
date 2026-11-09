import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { DEFAULT_REMINDER_INTERVAL_MINUTES } from "@/domain/intake";
import { DEFAULT_NOTIFICATION_SOUND, type NotificationSound } from "@/domain/sound";
import { synchronousStorage } from "@/shared/storage/synchronousStorage";

const SETTINGS_STORAGE_KEY = "settings";

export const LOW_STOCK_DAYS = { minimum: 1, maximum: 30, default: 7 } as const;

export type AppLanguage = "fr" | "en";

export type AppColorScheme = "light" | "dark";

type SettingsState = {
  defaultReminderIntervalMinutes: number;
  defaultReminderSound: NotificationSound;
  lowStockDays: number;
  lowStockSound: NotificationSound;
  language: AppLanguage | null;
  colorScheme: AppColorScheme | null;
  setDefaultReminderIntervalMinutes: (minutes: number) => void;
  setDefaultReminderSound: (sound: NotificationSound) => void;
  setLowStockDays: (days: number) => void;
  setLowStockSound: (sound: NotificationSound) => void;
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
      defaultReminderSound: DEFAULT_NOTIFICATION_SOUND,
      lowStockDays: LOW_STOCK_DAYS.default,
      lowStockSound: DEFAULT_NOTIFICATION_SOUND,
      language: null,
      colorScheme: null,
      setDefaultReminderIntervalMinutes: (minutes) =>
        set({ defaultReminderIntervalMinutes: minutes }),
      setDefaultReminderSound: (sound) => set({ defaultReminderSound: sound }),
      setLowStockDays: (days) => set({ lowStockDays: clampLowStockDays(days) }),
      setLowStockSound: (sound) => set({ lowStockSound: sound }),
      setLanguage: (language) => set({ language }),
      setColorScheme: (colorScheme) => set({ colorScheme }),
    }),
    {
      name: SETTINGS_STORAGE_KEY,
      storage: createJSONStorage(() => synchronousStorage),
      partialize: ({
        defaultReminderIntervalMinutes,
        defaultReminderSound,
        lowStockDays,
        lowStockSound,
        language,
        colorScheme,
      }) => ({
        defaultReminderIntervalMinutes,
        defaultReminderSound,
        lowStockDays,
        lowStockSound,
        language,
        colorScheme,
      }),
    },
  ),
);
