import { Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Icon } from "@/design-system/components/Icon/Icon";
import { Text } from "@/design-system/components/Text/Text";
import { useThemeColors } from "@/design-system/hooks/useThemeColors";
import type { NotificationSound } from "@/domain/sound";

import { formatSoundName } from "@/features/notifications/utils/formatters";
import { FormGroup } from "./FormGroup";
import { useStyles } from "./IntakeSoundField.styles";

type IntakeSoundFieldProps = {
  sound: NotificationSound;
  onPress: () => void;
};

export function IntakeSoundField({ sound, onPress }: IntakeSoundFieldProps) {
  const styles = useStyles();
  const themeColors = useThemeColors();
  const { t } = useTranslation("pillbox");
  const { t: translateNotifications } = useTranslation("notifications");
  const soundName = formatSoundName(translateNotifications, sound);
  return (
    <FormGroup>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("Son : {{sound}}", { sound: soundName })}
        accessibilityHint={t("Ouvre le choix du son du rappel")}
        onPress={onPress}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      >
        <Text variant="bodyBold">{t("Son")}</Text>
        <View style={styles.value}>
          <Text tone="secondary" style={styles.valueText}>
            {soundName}
          </Text>
          <Icon name="chevronRight" color={themeColors.inkSecondary} />
        </View>
      </Pressable>
    </FormGroup>
  );
}
