import type { View } from "react-native";

import { useAccessibilityFocusWhenActive } from "./useAccessibilityFocusWhenActive";

export function useAccessibilityFocusOnMount<Element extends View>() {
  return useAccessibilityFocusWhenActive<Element>(true);
}
