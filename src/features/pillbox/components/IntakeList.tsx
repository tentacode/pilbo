import { View } from "react-native";

import type { Intake } from "@/domain/intake";

import { IntakeCard } from "./IntakeCard";
import { styles } from "./IntakeList.styles";

type IntakeListProps = {
  intakes: Intake[];
  nextIntakeDates: Map<string, Date | null>;
  now: Date;
  onIntakePress: (intakeId: string) => void;
};

export function IntakeList({ intakes, nextIntakeDates, now, onIntakePress }: IntakeListProps) {
  return (
    <View style={styles.list}>
      {intakes.map((intake) => (
        <IntakeCard
          key={intake.id}
          intake={intake}
          nextIntakeDate={nextIntakeDates.get(intake.id) ?? null}
          now={now}
          onPress={() => onIntakePress(intake.id)}
        />
      ))}
    </View>
  );
}
