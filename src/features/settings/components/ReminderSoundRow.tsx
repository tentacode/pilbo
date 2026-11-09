import { router } from "expo-router";
import { useTranslation } from "react-i18next";

import { useSettingsStore } from "../store/settingsStore";
import { SoundSettingsRow } from "./SoundSettingsRow";

export function ReminderSoundRow() {
  const { t } = useTranslation("settings");
  const sound = useSettingsStore((state) => state.defaultReminderSound);
  return (
    <SoundSettingsRow
      label={t("Son par défaut")}
      sound={sound}
      onPress={() => router.push({ pathname: "/sound", params: { kind: "reminder" } })}
    />
  );
}
