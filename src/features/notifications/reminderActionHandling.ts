import * as Notifications from "expo-notifications";

import { database } from "@/shared/database/database";
import { migrateDatabase } from "@/shared/database/migrateDatabase";

import { applyReminderAction } from "./applyReminderAction";
import { completeReminderAction, registerBackgroundReminderActions } from "./reminderActionSupport";
import { rescheduleReminders } from "./rescheduleReminders";
import { reminderActionStatus, reminderIntakeOf } from "./utils/reminderActions";

export async function handleReminderAction(
  response: Notifications.NotificationResponse,
): Promise<void> {
  const status = reminderActionStatus(response.actionIdentifier);
  if (status === undefined) {
    return;
  }
  const { identifier, content } = response.notification.request;
  try {
    const reminderIntake = reminderIntakeOf(content);
    await migrateDatabase();
    const now = new Date();
    if (reminderIntake) {
      applyReminderAction(database, reminderIntake, status, now);
    }
    await rescheduleReminders(database, now);
  } catch (error) {
    console.error("Reminder action could not be handled", error);
  } finally {
    completeReminderAction(identifier, response.actionIdentifier);
  }
}

// Started from the entry point: an action can launch the app in the background, without any screen.
export function startReminderActionHandling(): void {
  registerBackgroundReminderActions(handleReminderAction);
  Notifications.addNotificationResponseReceivedListener(handleReminderAction);
  const lastResponse = Notifications.getLastNotificationResponse();
  if (lastResponse) {
    handleReminderAction(lastResponse);
  }
}
