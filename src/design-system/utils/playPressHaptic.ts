import * as Haptics from "expo-haptics";

export function playPressHaptic() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}
