import enCalendar from "./locales/en/calendar.json";
import enCommon from "./locales/en/common.json";
import enNotifications from "./locales/en/notifications.json";
import enOnboarding from "./locales/en/onboarding.json";
import enPillbox from "./locales/en/pillbox.json";
import enSettings from "./locales/en/settings.json";
import enStocks from "./locales/en/stocks.json";
import enToday from "./locales/en/today.json";
import frCalendar from "./locales/fr/calendar.json";
import frCommon from "./locales/fr/common.json";
import frNotifications from "./locales/fr/notifications.json";
import frOnboarding from "./locales/fr/onboarding.json";
import frPillbox from "./locales/fr/pillbox.json";
import frSettings from "./locales/fr/settings.json";
import frStocks from "./locales/fr/stocks.json";
import frToday from "./locales/fr/today.json";

export const DEFAULT_NAMESPACE = "common";

export const resources = {
  fr: {
    common: frCommon,
    today: frToday,
    pillbox: frPillbox,
    stocks: frStocks,
    settings: frSettings,
    onboarding: frOnboarding,
    notifications: frNotifications,
    calendar: frCalendar,
  },
  en: {
    common: enCommon,
    today: enToday,
    pillbox: enPillbox,
    stocks: enStocks,
    settings: enSettings,
    onboarding: enOnboarding,
    notifications: enNotifications,
    calendar: enCalendar,
  },
} as const;

export type Language = keyof typeof resources;
