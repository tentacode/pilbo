import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/design-system/components/Button/Button";
import { Sheet } from "@/design-system/components/Sheet/Sheet";
import { NOTIFICATION_SOUNDS, type NotificationSound } from "@/domain/sound";

import { FormGroup } from "@/features/pillbox/components/FormGroup";
import { SoundOption } from "./components/SoundOption";
import { useSoundPreview } from "./hooks/useSoundPreview";
import { formatSoundName } from "./utils/formatters";

type SoundPickerScreenProps = {
  title: string;
  initialSound: NotificationSound;
  onConfirm: (sound: NotificationSound) => void;
};

export function SoundPickerScreen({ title, initialSound, onConfirm }: SoundPickerScreenProps) {
  const { t } = useTranslation("notifications");
  const [selectedSound, setSelectedSound] = useState(initialSound);
  const soundPreview = useSoundPreview();

  function select(sound: NotificationSound) {
    setSelectedSound(sound);
    soundPreview.play(sound);
  }

  return (
    <Sheet
      title={title}
      leftAction={{ label: t("Annuler"), onPress: () => router.back() }}
      footer={<Button label={t("Valider")} icon="check" onPress={() => onConfirm(selectedSound)} />}
    >
      <View accessibilityRole="radiogroup" accessibilityLabel={title}>
        <FormGroup>
          {NOTIFICATION_SOUNDS.map((sound, index) => (
            <SoundOption
              key={sound}
              name={formatSoundName(t, sound)}
              isSelected={sound === selectedSound}
              hasTopBorder={index > 0}
              accessibilityHint={
                sound === "vibration" ? t("Fait vibrer le téléphone") : t("Joue le son")
              }
              onPress={() => select(sound)}
            />
          ))}
        </FormGroup>
      </View>
    </Sheet>
  );
}
