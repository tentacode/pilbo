import { useEffect, useRef } from "react";
import { AccessibilityInfo, findNodeHandle, type View } from "react-native";

export function useAccessibilityFocusWhenActive<Element extends View>(isActive: boolean) {
  const reference = useRef<Element>(null);

  useEffect(() => {
    if (!isActive) return;
    const node = reference.current ? findNodeHandle(reference.current) : null;
    if (node !== null) {
      AccessibilityInfo.setAccessibilityFocus(node);
    }
  }, [isActive]);

  return reference;
}
