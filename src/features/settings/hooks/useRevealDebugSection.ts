import { useCallback, useLayoutEffect, useRef } from "react";
import type { ScrollView } from "react-native";

import { useReduceMotion } from "@/design-system/hooks/useReduceMotion";

export function useRevealDebugSection(isDebugMode: boolean) {
  const scrollViewReference = useRef<ScrollView>(null);
  const reduceMotion = useReduceMotion();
  const shouldReveal = useRef(false);

  useLayoutEffect(() => {
    shouldReveal.current = isDebugMode;
  }, [isDebugMode]);

  // Scrolls once per activation, not on every later layout of the section.
  const onDebugSectionLayout = useCallback(() => {
    if (!shouldReveal.current) {
      return;
    }
    shouldReveal.current = false;
    scrollViewReference.current?.scrollToEnd({ animated: !reduceMotion });
  }, [reduceMotion]);

  return { scrollViewReference, onDebugSectionLayout };
}
