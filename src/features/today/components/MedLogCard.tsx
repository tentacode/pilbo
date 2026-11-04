import { Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Icon } from "@/design-system/components/Icon/Icon";
import { Pill } from "@/design-system/components/Pill/Pill";
import { Text } from "@/design-system/components/Text/Text";
import { colors, sizes } from "@/design-system/tokens";
import { formatMedLabel } from "@/domain/med";

import { formatMedLogTakenAt } from "@/features/today/utils/formatters";
import type { MedLogOfDay } from "@/features/today/utils/todayTypes";
import { useStyles } from "./MedLogCard.styles";

type MedLogCardProps = {
  medLog: MedLogOfDay;
  onPress: () => void;
};

export function MedLogCard({ medLog: { med, takenAt }, onPress }: MedLogCardProps) {
  const styles = useStyles();
  const { t } = useTranslation("today");
  const takenText = formatMedLogTakenAt(t, takenAt);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${formatMedLabel(med)}, ${takenText}`}
      accessibilityHint={t("Modifie la prise.")}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Pill design={med.design} displaySize={sizes.pillInPicker} />
      <View style={styles.texts}>
        <Text variant="bodyBold">
          {med.name}
          {med.strength === "" ? null : <Text> {med.strength}</Text>}
        </Text>
        <Text variant="small" tone="secondary">
          {takenText}
        </Text>
      </View>
      <Icon name="chevronRight" size={sizes.iconSmall} color={colors.inkSecondary} />
    </Pressable>
  );
}
