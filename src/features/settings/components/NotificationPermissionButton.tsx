import { Button } from "@/design-system/components/Button/Button";

import { useNotificationPermission } from "@/features/notifications/hooks/useNotificationPermission";

export function NotificationPermissionButton() {
  const { isGranted, request } = useNotificationPermission();

  if (isGranted !== false) {
    return null;
  }

  return (
    <Button
      label="Accepter les notifications"
      variant="secondary"
      accessibilityHint="Permet de recevoir les rappels de vos prises"
      onPress={request}
    />
  );
}
