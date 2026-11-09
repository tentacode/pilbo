import { router } from "expo-router";
import { useTranslation } from "react-i18next";

import { SoundPickerScreen } from "@/features/notifications/SoundPickerScreen";
import { useIntakeDraft } from "./hooks/useIntakeDraft";

export function IntakeSoundScreen() {
  const { t } = useTranslation("pillbox");
  const { draft, setSound } = useIntakeDraft();
  return (
    <SoundPickerScreen
      title={t("Son du rappel")}
      initialSound={draft.sound}
      onConfirm={(sound) => {
        setSound(sound);
        router.back();
      }}
    />
  );
}
