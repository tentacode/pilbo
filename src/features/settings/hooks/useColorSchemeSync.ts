import { useEffect } from "react";

import { useSettingsStore } from "../store/settingsStore";
import { applyColorScheme } from "../utils/appColorScheme";

export function useColorSchemeSync(): void {
  const colorScheme = useSettingsStore((state) => state.colorScheme);

  useEffect(() => {
    applyColorScheme(colorScheme);
  }, [colorScheme]);
}
