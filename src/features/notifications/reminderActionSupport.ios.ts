import { requireNativeModule } from "expo";

type PatchedEmitterModule = {
  completeNotificationAction: (notificationIdentifier: string, actionIdentifier: string) => void;
};

export function registerBackgroundReminderActions(): void {}

export function completeReminderAction(
  notificationIdentifier: string,
  actionIdentifier: string,
): void {
  requireNativeModule<PatchedEmitterModule>("ExpoNotificationsEmitter").completeNotificationAction(
    notificationIdentifier,
    actionIdentifier,
  );
}
