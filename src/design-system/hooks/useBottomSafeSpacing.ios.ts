import { useSafeAreaInsets } from "react-native-safe-area-context";

import { spacing } from "../tokens";

export function useBottomSafeSpacing() {
  const insets = useSafeAreaInsets();
  return Math.max(insets.bottom, spacing.large);
}
