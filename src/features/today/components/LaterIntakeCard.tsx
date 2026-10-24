import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/design-system/components/Button/Button";

import { formatTakeAccessibilityLabel } from "@/features/today/utils/formatters";
import type { TodayIntake } from "@/features/today/utils/todayTypes";
import { IntakeCardHeading } from "./IntakeCardHeading";
import { styles } from "./LaterIntakeCard.styles";
import { TodayMedList } from "./TodayMedList";

type LaterIntakeCardProps = {
  todayIntake: TodayIntake;
  isDisabled?: boolean;
  onTake: (intakeId: string) => void;
};

export function LaterIntakeCard({ todayIntake, isDisabled = false, onTake }: LaterIntakeCardProps) {
  const { t } = useTranslation("today");
  const { intake } = todayIntake;

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <IntakeCardHeading todayIntake={todayIntake} />
        <Button
          label={t("Prendre en avance")}
          variant="secondary"
          accessibilityLabel={formatTakeAccessibilityLabel(t, intake)}
          isDisabled={isDisabled}
          onPress={() => onTake(intake.id)}
        />
      </View>
      <TodayMedList medQuantities={intake.medQuantities} />
    </View>
  );
}
