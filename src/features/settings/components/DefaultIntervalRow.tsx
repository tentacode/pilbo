import { SegmentedControl } from "@/design-system/components/SegmentedControl/SegmentedControl";
import { useTranslation } from "react-i18next";

import { reminderIntervalOptions } from "@/features/pillbox/utils/reminderIntervalOptions";

import { useSettingsStore } from "../store/settingsStore";
import { SettingsRow } from "./SettingsRow";

export function DefaultIntervalRow() {
  const { t } = useTranslation("settings");
  const { t: translateCommon } = useTranslation("common");
  const minutes = useSettingsStore((state) => state.defaultReminderIntervalMinutes);
  const setMinutes = useSettingsStore((state) => state.setDefaultReminderIntervalMinutes);

  return (
    <SettingsRow label={t("Intervalle par défaut")} isFullWidthControl>
      <SegmentedControl
        options={reminderIntervalOptions(translateCommon)}
        selectedValue={minutes}
        onChange={setMinutes}
        accessibilityLabel={t("Intervalle par défaut des rappels")}
      />
    </SettingsRow>
  );
}
