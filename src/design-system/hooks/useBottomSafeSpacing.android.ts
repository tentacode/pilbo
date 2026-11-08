import { useSafeAreaInsets } from "react-native-safe-area-context";

import { spacing } from "../tokens";

export function useBottomSafeSpacing() {
  const insets = useSafeAreaInsets();
  return insets.bottom + spacing.small;
}
