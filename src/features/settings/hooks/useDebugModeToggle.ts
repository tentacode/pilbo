import { useCallback, useEffect, useRef, useState } from "react";
import { AccessibilityInfo } from "react-native";
import { useTranslation } from "react-i18next";

import { playPressHaptic } from "@/design-system/utils/playPressHaptic";

export const DEBUG_MODE_PRESS_COUNT = 10;
const PRESS_COUNT_RESET_DELAY_MILLISECONDS = 2000;

export function useDebugModeToggle() {
  const { t } = useTranslation("settings");
  const [isDebugMode, setIsDebugMode] = useState(false);
  const pressCount = useRef(0);
  const resetTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(resetTimeout.current), []);

  const registerPress = useCallback(() => {
    clearTimeout(resetTimeout.current);
    pressCount.current += 1;

    if (pressCount.current < DEBUG_MODE_PRESS_COUNT) {
      resetTimeout.current = setTimeout(() => {
        pressCount.current = 0;
      }, PRESS_COUNT_RESET_DELAY_MILLISECONDS);
      return;
    }

    pressCount.current = 0;
    const nextIsDebugMode = !isDebugMode;
    setIsDebugMode(nextIsDebugMode);
    playPressHaptic();
    AccessibilityInfo.announceForAccessibility(
      nextIsDebugMode ? t("Mode debug activé") : t("Mode debug désactivé"),
    );
  }, [isDebugMode, t]);

  return { isDebugMode, registerPress };
}
