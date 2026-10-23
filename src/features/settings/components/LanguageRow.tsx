import { SegmentedControl } from "@/design-system/components/SegmentedControl/SegmentedControl";

import { useAppLanguage } from "../hooks/useAppLanguage";
import { type AppLanguage, useSettingsStore } from "../store/settingsStore";
import { SettingsRow } from "./SettingsRow";

const LANGUAGE_OPTIONS: { value: AppLanguage; label: string }[] = [
  { value: "fr", label: "Français" },
  { value: "en", label: "English" },
];

export function LanguageRow() {
  const language = useAppLanguage();
  const setLanguage = useSettingsStore((state) => state.setLanguage);

  return (
    <SettingsRow label="Langue de l'app" isFullWidthControl>
      <SegmentedControl
        options={LANGUAGE_OPTIONS}
        selectedValue={language}
        onChange={setLanguage}
        accessibilityLabel="Langue de l'app"
      />
    </SettingsRow>
  );
}
