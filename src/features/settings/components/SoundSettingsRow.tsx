import { useTranslation } from "react-i18next";

import { Text } from "@/design-system/components/Text/Text";
import type { NotificationSound } from "@/domain/sound";

import { formatSoundName } from "@/features/notifications/utils/formatters";

import { SettingsRow } from "./SettingsRow";

type SoundSettingsRowProps = {
  label: string;
  sound: NotificationSound;
  onPress: () => void;
};

export function SoundSettingsRow({ label, sound, onPress }: SoundSettingsRowProps) {
  const { t } = useTranslation("settings");
  const { t: translateNotifications } = useTranslation("notifications");
  const soundName = formatSoundName(translateNotifications, sound);
  return (
    <SettingsRow
      label={label}
      hasChevron
      onPress={onPress}
      accessibilityLabel={t("{{label}} : {{sound}}", { label, sound: soundName })}
      accessibilityRole="button"
      accessibilityHint={t("Ouvre le choix du son")}
    >
      <Text tone="secondary">{soundName}</Text>
    </SettingsRow>
  );
}
