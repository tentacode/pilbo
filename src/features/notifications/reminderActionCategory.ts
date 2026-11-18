import * as Notifications from "expo-notifications";

import { i18n } from "@/shared/i18n/i18n";

import { REMINDER_ACTION_IDENTIFIERS, REMINDER_CATEGORY_IDENTIFIER } from "./utils/reminderActions";

export async function registerReminderActions(): Promise<void> {
  await Notifications.setNotificationCategoryAsync(REMINDER_CATEGORY_IDENTIFIER, [
    {
      identifier: REMINDER_ACTION_IDENTIFIERS.taken,
      buttonTitle: i18n.t("Je l'ai pris", { ns: "notifications" }),
      options: { opensAppToForeground: false },
    },
    {
      identifier: REMINDER_ACTION_IDENTIFIERS.skipped,
      buttonTitle: i18n.t("Ignorer", { ns: "notifications" }),
      options: { opensAppToForeground: false },
    },
  ]);
}
