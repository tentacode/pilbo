import { Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Icon } from "@/design-system/components/Icon/Icon";
import { Text } from "@/design-system/components/Text/Text";
import { useThemeColors } from "@/design-system/hooks/useThemeColors";

import { FormGroup } from "./FormGroup";
import { useStyles } from "./IntakeRecurrenceRow.styles";

type IntakeRecurrenceRowProps = {
  recurrence: string;
  nextIntake: string | null;
  onPress: () => void;
};

export function IntakeRecurrenceRow({ recurrence, nextIntake, onPress }: IntakeRecurrenceRowProps) {
  const styles = useStyles();
  const themeColors = useThemeColors();
  const { t } = useTranslation("pillbox");
  return (
    <View style={styles.container}>
      <FormGroup>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={nextIntake === null ? recurrence : `${recurrence}. ${nextIntake}`}
          accessibilityHint={t("Ouvre le choix des jours de prise")}
          onPress={onPress}
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}
        >
          <View style={styles.texts}>
            <Text variant="bodyBold">{recurrence}</Text>
            {nextIntake === null ? null : (
              <Text variant="small" tone="secondary">
                {nextIntake}
              </Text>
            )}
          </View>
          <Icon name="chevronRight" color={themeColors.inkSecondary} />
        </Pressable>
      </FormGroup>
    </View>
  );
}
