import {
  SegmentedControl,
  type SegmentedControlOption,
} from "@/design-system/components/SegmentedControl/SegmentedControl";
import { useTranslation } from "react-i18next";

import { useAppColorScheme } from "../hooks/useAppColorScheme";
import { type AppColorScheme, useSettingsStore } from "../store/settingsStore";
import { SettingsRow } from "./SettingsRow";

export function AppearanceRow() {
  const { t } = useTranslation("settings");
  const colorScheme = useAppColorScheme();
  const setColorScheme = useSettingsStore((state) => state.setColorScheme);
  const options: SegmentedControlOption<AppColorScheme>[] = [
    { value: "light", label: t("Clair"), icon: "sun" },
    { value: "dark", label: t("Sombre"), icon: "moon" },
  ];

  return (
    <SettingsRow label={t("Apparence")} isFullWidthControl>
      <SegmentedControl
        options={options}
        selectedValue={colorScheme}
        onChange={setColorScheme}
        accessibilityLabel={t("Apparence")}
      />
    </SettingsRow>
  );
}
