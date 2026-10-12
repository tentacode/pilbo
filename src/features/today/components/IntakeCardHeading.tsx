import { View } from "react-native";

import { Text } from "@/design-system/components/Text/Text";
import { formatIntakeTime } from "@/domain/intake";

import { formatIntakeStatus } from "@/features/today/utils/formatters";
import type { TodayIntake } from "@/features/today/utils/todayTypes";
import { styles } from "./IntakeCardHeading.styles";
import { IntakeStatusLabel } from "./IntakeStatusLabel";

type IntakeCardHeadingProps = {
  todayIntake: TodayIntake;
};

export function IntakeCardHeading({ todayIntake }: IntakeCardHeadingProps) {
  const time = formatIntakeTime(todayIntake.intake.time);
  const status = formatIntakeStatus(todayIntake);

  return (
    <View
      accessible
      accessibilityLabel={`${time}, ${status.accessibilityLabel}`}
      style={styles.heading}
    >
      <Text variant="time" style={styles.time}>
        {time}
      </Text>
      <IntakeStatusLabel todayIntake={todayIntake} />
    </View>
  );
}
