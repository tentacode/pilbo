import { View } from "react-native";

import type { Intake } from "@/domain/intake";

import { IntakeCard } from "./IntakeCard";
import { styles } from "./IntakeList.styles";

type IntakeListProps = {
  intakes: Intake[];
  onIntakePress: (intakeId: string) => void;
};

export function IntakeList({ intakes, onIntakePress }: IntakeListProps) {
  return (
    <View style={styles.list}>
      {intakes.map((intake) => (
        <IntakeCard key={intake.id} intake={intake} onPress={() => onIntakePress(intake.id)} />
      ))}
    </View>
  );
}
