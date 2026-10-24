import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text } from "@/design-system/components/Text/Text";

import { formatIntakeStatus } from "@/features/today/utils/formatters";
import type { TodayIntake } from "@/features/today/utils/todayTypes";
import { styles } from "./IntakeCardHeading.styles";
import { IntakeStatusLabel } from "./IntakeStatusLabel";
import { formatIntakeTime } from "@/shared/i18n/formatters";

type IntakeCardHeadingProps = {
  todayIntake: TodayIntake;
};

export function IntakeCardHeading({ todayIntake }: IntakeCardHeadingProps) {
  const { t } = useTranslation("today");
  const time = formatIntakeTime(todayIntake.intake.time);
  const status = formatIntakeStatus(t, todayIntake);

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
