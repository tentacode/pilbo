import { useEffect, useRef } from "react";
import { AccessibilityInfo, findNodeHandle, type View } from "react-native";

export function useAccessibilityFocusOnMount<Element extends View>() {
  const reference = useRef<Element>(null);

  useEffect(() => {
    const node = reference.current ? findNodeHandle(reference.current) : null;
    if (node !== null) {
      AccessibilityInfo.setAccessibilityFocus(node);
    }
  }, []);

  return reference;
}
