import { View } from "react-native";

import type { Intake } from "@/domain/intake";

import { IntakeCard } from "./IntakeCard";
import { styles } from "./IntakeList.styles";

type IntakeListProps = {
  intakes: Intake[];
};

export function IntakeList({ intakes }: IntakeListProps) {
  return (
    <View style={styles.list}>
      {intakes.map((intake) => (
        <IntakeCard key={intake.id} intake={intake} />
      ))}
    </View>
  );
}
