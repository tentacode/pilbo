import { View } from "react-native";

import type { NotTakenStatus } from "@/domain/intakeLog";

import type { TodayIntake } from "@/features/today/utils/todayTypes";
import { IntakeCardActions } from "./IntakeCardActions";
import { IntakeCardHeading } from "./IntakeCardHeading";
import { useStyles } from "./LateIntakeCard.styles";
import { TodayMedList } from "./TodayMedList";

type LateIntakeCardProps = {
  todayIntake: TodayIntake;
  isDisabled?: boolean;
  onTake: (intakeId: string) => void;
  onNotTaken: (intakeId: string, status: NotTakenStatus) => void;
};

export function LateIntakeCard({
  todayIntake,
  isDisabled,
  onTake,
  onNotTaken,
}: LateIntakeCardProps) {
  const styles = useStyles();
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <IntakeCardHeading todayIntake={todayIntake} />
      </View>
      <TodayMedList medQuantities={todayIntake.intake.medQuantities} isLate />
      <IntakeCardActions
        intake={todayIntake.intake}
        isDisabled={isDisabled}
        isLate
        onTake={onTake}
        onNotTaken={onNotTaken}
      />
    </View>
  );
}
