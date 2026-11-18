import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";

const REMINDER_ACTION_TASK = "intake-reminder-action";

// Android runs this task for an action button when the app is in the background or killed.
export function registerBackgroundReminderActions(
  handleResponse: (response: Notifications.NotificationResponse) => Promise<void>,
): void {
  TaskManager.defineTask<Notifications.NotificationTaskPayload>(
    REMINDER_ACTION_TASK,
    async ({ data }) => {
      if ("actionIdentifier" in data) {
        await handleResponse(data);
      }
    },
  );
  Notifications.registerTaskAsync(REMINDER_ACTION_TASK).catch((error: unknown) => {
    console.error("Reminder action task could not be registered", error);
  });
}

export function completeReminderAction(): void {}
