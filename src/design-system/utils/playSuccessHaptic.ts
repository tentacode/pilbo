import * as Haptics from "expo-haptics";

export function playSuccessHaptic() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}
