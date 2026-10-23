import { SegmentedControl } from "@/design-system/components/SegmentedControl/SegmentedControl";

import { REMINDER_INTERVAL_OPTIONS } from "@/features/pillbox/utils/reminderIntervalOptions";

import { useSettingsStore } from "../store/settingsStore";
import { SettingsRow } from "./SettingsRow";

export function DefaultIntervalRow() {
  const minutes = useSettingsStore((state) => state.defaultReminderIntervalMinutes);
  const setMinutes = useSettingsStore((state) => state.setDefaultReminderIntervalMinutes);

  return (
    <SettingsRow label="Intervalle par défaut" isFullWidthControl>
      <SegmentedControl
        options={REMINDER_INTERVAL_OPTIONS}
        selectedValue={minutes}
        onChange={setMinutes}
        accessibilityLabel="Intervalle par défaut des rappels"
      />
    </SettingsRow>
  );
}
