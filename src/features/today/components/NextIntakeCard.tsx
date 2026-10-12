import { View } from "react-native";

import type { TodayIntake } from "@/features/today/utils/todayTypes";
import { IntakeCardActions } from "./IntakeCardActions";
import { IntakeCardHeading } from "./IntakeCardHeading";
import { styles } from "./NextIntakeCard.styles";
import { TodayMedList } from "./TodayMedList";

type NextIntakeCardProps = {
  todayIntake: TodayIntake;
  onTake: (intakeId: string) => void;
  onSkip: (intakeId: string) => void;
};

export function NextIntakeCard({ todayIntake, onTake, onSkip }: NextIntakeCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <IntakeCardHeading todayIntake={todayIntake} />
      </View>
      <TodayMedList medQuantities={todayIntake.intake.medQuantities} />
      <IntakeCardActions intake={todayIntake.intake} onTake={onTake} onSkip={onSkip} />
    </View>
  );
}
