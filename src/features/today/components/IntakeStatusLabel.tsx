import { View } from "react-native";

import { Icon } from "@/design-system/components/Icon/Icon";
import { Text } from "@/design-system/components/Text/Text";
import { colors, sizes } from "@/design-system/tokens";

import { formatIntakeStatus } from "@/features/today/utils/formatters";
import type { TodayIntake } from "@/features/today/utils/todayTypes";
import { styles } from "./IntakeStatusLabel.styles";

type IntakeStatusLabelProps = {
  todayIntake: TodayIntake;
};

export function IntakeStatusLabel({ todayIntake }: IntakeStatusLabelProps) {
  const { text, accessibilityLabel } = formatIntakeStatus(todayIntake);
  const isLate = todayIntake.status === "late";

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      style={[styles.chip, isLate && styles.lateChip]}
    >
      <Icon
        name={isLate ? "alert" : "clock"}
        size={sizes.iconSmall}
        color={isLate ? colors.alertInk : colors.ink}
      />
      <Text variant="helpBold" tone={isLate ? "alert" : "primary"} style={styles.text}>
        {text}
      </Text>
    </View>
  );
}
