import { router } from "expo-router";
import { useTranslation } from "react-i18next";

import { useSettingsStore } from "../store/settingsStore";
import { SoundSettingsRow } from "./SoundSettingsRow";

export function LowStockSoundRow() {
  const { t } = useTranslation("settings");
  const sound = useSettingsStore((state) => state.lowStockSound);
  return (
    <SoundSettingsRow
      label={t("Son des alertes")}
      sound={sound}
      onPress={() => router.push({ pathname: "/sound", params: { kind: "lowStock" } })}
    />
  );
}
