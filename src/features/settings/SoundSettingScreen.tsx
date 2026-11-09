import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";

import { SoundPickerScreen } from "@/features/notifications/SoundPickerScreen";
import { rescheduleAfterChange } from "@/features/pillbox/hooks/useIntakeActions";

import { ApplySoundDialog } from "./components/ApplySoundDialog";
import { useDefaultReminderSound } from "./hooks/useDefaultReminderSound";
import { useSettingsStore } from "./store/settingsStore";

export type SoundSettingKind = "reminder" | "lowStock";

function DefaultReminderSoundScreen() {
  const { t } = useTranslation("settings");
  const defaultReminderSound = useDefaultReminderSound();
  return (
    <>
      <SoundPickerScreen
        title={t("Son par défaut")}
        initialSound={defaultReminderSound.defaultReminderSound}
        onConfirm={defaultReminderSound.confirm}
      />
      <ApplySoundDialog
        isVisible={defaultReminderSound.isApplyDialogVisible}
        onApplyToAllIntakes={defaultReminderSound.applyToAllIntakes}
        onKeepForNewIntakes={defaultReminderSound.keepForNewIntakes}
      />
    </>
  );
}

function LowStockSoundScreen() {
  const { t } = useTranslation("settings");
  const lowStockSound = useSettingsStore((state) => state.lowStockSound);
  const setLowStockSound = useSettingsStore((state) => state.setLowStockSound);
  return (
    <SoundPickerScreen
      title={t("Son des alertes")}
      initialSound={lowStockSound}
      onConfirm={(sound) => {
        setLowStockSound(sound);
        rescheduleAfterChange();
        router.back();
      }}
    />
  );
}

export function SoundSettingScreen() {
  const { kind } = useLocalSearchParams<{ kind?: SoundSettingKind }>();
  return kind === "lowStock" ? <LowStockSoundScreen /> : <DefaultReminderSoundScreen />;
}
