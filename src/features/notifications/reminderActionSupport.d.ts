import type { NotificationResponse } from "expo-notifications";

export declare function registerBackgroundReminderActions(
  handleResponse: (response: NotificationResponse) => Promise<void>,
): void;

export declare function completeReminderAction(
  notificationIdentifier: string,
  actionIdentifier: string,
): void;
