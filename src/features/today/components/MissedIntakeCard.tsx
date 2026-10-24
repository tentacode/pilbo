import { View } from "react-native";

import type { TodayIntake } from "@/features/today/utils/todayTypes";
import { IntakeCardHeading } from "./IntakeCardHeading";
import { styles } from "./MissedIntakeCard.styles";
import { TodayMedList } from "./TodayMedList";

type MissedIntakeCardProps = {
  todayIntake: TodayIntake;
};

export function MissedIntakeCard({ todayIntake }: MissedIntakeCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <IntakeCardHeading todayIntake={todayIntake} />
      </View>
      <TodayMedList medQuantities={todayIntake.intake.medQuantities} isLate />
    </View>
  );
}
