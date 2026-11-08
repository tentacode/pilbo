import { useNavigation } from "expo-router";
import { StackActions } from "expo-router/react-navigation";
import { useEffect, useEffectEvent, useRef } from "react";
import type { ScrollView } from "react-native";

import { useReduceMotion } from "@/design-system/hooks/useReduceMotion";

import { type ResettableTab, useTabResetStore } from "./tabResetStore";

export function useTabReset(tab: ResettableTab, onReset?: () => void) {
  const scrollViewReference = useRef<ScrollView>(null);
  const navigation = useNavigation();
  const reduceMotion = useReduceMotion();

  const reset = useEffectEvent(() => {
    if ((navigation.getState()?.index ?? 0) > 0) {
      navigation.dispatch(StackActions.popToTop());
    }
    scrollViewReference.current?.scrollTo({ y: 0, animated: !reduceMotion });
    onReset?.();
  });

  useEffect(
    () =>
      useTabResetStore.subscribe(({ requestCounts }, previousState) => {
        if (requestCounts[tab] !== previousState.requestCounts[tab]) {
          reset();
        }
      }),
    [tab],
  );

  return scrollViewReference;
}
