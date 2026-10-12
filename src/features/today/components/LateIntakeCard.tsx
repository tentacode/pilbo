import { View } from "react-native";

import type { TodayIntake } from "@/features/today/utils/todayTypes";
import { IntakeCardActions } from "./IntakeCardActions";
import { IntakeCardHeading } from "./IntakeCardHeading";
import { styles } from "./LateIntakeCard.styles";
import { TodayMedList } from "./TodayMedList";

type LateIntakeCardProps = {
  todayIntake: TodayIntake;
  onTake: (intakeId: string) => void;
  onSkip: (intakeId: string) => void;
};

export function LateIntakeCard({ todayIntake, onTake, onSkip }: LateIntakeCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <IntakeCardHeading todayIntake={todayIntake} />
      </View>
      <TodayMedList medQuantities={todayIntake.intake.medQuantities} isLate />
      <IntakeCardActions intake={todayIntake.intake} isLate onTake={onTake} onSkip={onSkip} />
    </View>
  );
}
