import { Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Icon } from "@/design-system/components/Icon/Icon";
import { useThemeColors } from "@/design-system/hooks/useThemeColors";
import { sizes } from "@/design-system/tokens";

import { formatEarlierIntakeAccessibilityLabel } from "@/features/today/utils/formatters";
import type { TodayIntake } from "@/features/today/utils/todayTypes";
import { IntakeCardHeading } from "./IntakeCardHeading";
import { useStyles } from "./MissedIntakeCard.styles";
import { TodayMedList } from "./TodayMedList";

type MissedIntakeCardProps = {
  todayIntake: TodayIntake;
  onPress: () => void;
};

export function MissedIntakeCard({ todayIntake, onPress }: MissedIntakeCardProps) {
  const themeColors = useThemeColors();
  const styles = useStyles();
  const { t } = useTranslation("today");
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={formatEarlierIntakeAccessibilityLabel(t, todayIntake)}
      accessibilityHint={t("Modifie la prise.")}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.head}>
        <IntakeCardHeading todayIntake={todayIntake} />
        <Icon name="chevronRight" size={sizes.iconSmall} color={themeColors.inkSecondary} />
      </View>
      <TodayMedList medQuantities={todayIntake.intake.medQuantities} isLate />
    </Pressable>
  );
}
