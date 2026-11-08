import { Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/design-system/components/Button/Button";
import { Icon } from "@/design-system/components/Icon/Icon";
import { Text } from "@/design-system/components/Text/Text";
import { useThemeColors } from "@/design-system/hooks/useThemeColors";
import { sizes } from "@/design-system/tokens";

import { formatTakenTime } from "@/features/today/utils/formatters";
import { styles } from "./MedTakingSection.styles";

type MedTakingSectionProps = {
  isScheduled: boolean;
  summary?: string;
  lastTakenAt?: string;
  onTake: () => void;
  onOpenDay: () => void;
  onUndo: () => void;
};

export function MedTakingSection({
  isScheduled,
  summary,
  lastTakenAt,
  onTake,
  onOpenDay,
  onUndo,
}: MedTakingSectionProps) {
  const themeColors = useThemeColors();
  const { t } = useTranslation("meds");
  return (
    <View>
      <Button
        label={t("Prendre 1 comprimé")}
        icon="check"
        variant={isScheduled ? "secondary" : "primary"}
        size="large"
        onPress={onTake}
      />
      {summary === undefined ? null : (
        <Pressable
          accessibilityRole="button"
          accessibilityHint={t("Ouvre le jour de la prise.")}
          onPress={onOpenDay}
          style={({ pressed }) => [styles.summary, pressed && styles.pressed]}
        >
          <Text variant="small" tone="secondary" style={styles.summaryText}>
            {summary}
          </Text>
          <Icon name="chevronRight" size={sizes.iconSmall} color={themeColors.inkSecondary} />
        </Pressable>
      )}
      {lastTakenAt === undefined ? null : (
        <View style={styles.undo}>
          <Button
            label={t("Annuler")}
            accessibilityLabel={t("Annuler la prise de {{time}}", {
              time: formatTakenTime(lastTakenAt),
            })}
            variant="text"
            icon="undo"
            onPress={onUndo}
          />
        </View>
      )}
    </View>
  );
}
