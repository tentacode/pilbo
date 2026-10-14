import { View } from "react-native";

import { formatLateSectionTitle } from "@/features/today/utils/formatters";
import type { TodaySections } from "@/features/today/utils/todayTypes";
import { EarlierIntakeCard } from "./EarlierIntakeCard";
import { LateIntakeCard } from "./LateIntakeCard";
import { LaterIntakeCard } from "./LaterIntakeCard";
import { NextIntakeCard } from "./NextIntakeCard";
import { styles } from "./TodayIntakeSections.styles";
import { TodaySectionTitle } from "./TodaySectionTitle";

type TodayIntakeSectionsProps = {
  sections: TodaySections;
  validatingIntakeId: string | null;
  onTake: (intakeId: string) => void;
  onSkip: (intakeId: string) => void;
};

export function TodayIntakeSections({
  sections,
  validatingIntakeId,
  onTake,
  onSkip,
}: TodayIntakeSectionsProps) {
  const { late, next, later, earlier } = sections;
  const hasLate = late.length > 0;
  const lateTitle = formatLateSectionTitle(late.length);

  const nextCard = next ? (
    <NextIntakeCard
      todayIntake={next}
      isDisabled={next.intake.id === validatingIntakeId}
      onTake={onTake}
      onSkip={onSkip}
    />
  ) : null;
  const laterCards = later.map((todayIntake) => (
    <LaterIntakeCard
      key={todayIntake.intake.id}
      todayIntake={todayIntake}
      isDisabled={todayIntake.intake.id === validatingIntakeId}
      onTake={onTake}
    />
  ));

  return (
    <View style={styles.sections}>
      {hasLate ? (
        <View>
          {lateTitle ? <TodaySectionTitle title={lateTitle} /> : null}
          <View style={styles.list}>
            {late.map((todayIntake) => (
              <LateIntakeCard
                key={todayIntake.intake.id}
                todayIntake={todayIntake}
                isDisabled={todayIntake.intake.id === validatingIntakeId}
                onTake={onTake}
                onSkip={onSkip}
              />
            ))}
          </View>
        </View>
      ) : null}
      {hasLate && next ? (
        <View>
          <TodaySectionTitle title="Ensuite" />
          <View style={styles.list}>
            {nextCard}
            {laterCards}
          </View>
        </View>
      ) : null}
      {!hasLate && next ? (
        <View>
          <TodaySectionTitle title="Prochaine prise" />
          {nextCard}
        </View>
      ) : null}
      {!hasLate && later.length > 0 ? (
        <View>
          <TodaySectionTitle title="Plus tard" />
          <View style={styles.list}>{laterCards}</View>
        </View>
      ) : null}
      {earlier.length > 0 ? (
        <View>
          <TodaySectionTitle title="Plus tôt" />
          <View style={styles.list}>
            {earlier.map((todayIntake) => (
              <EarlierIntakeCard key={todayIntake.intake.id} todayIntake={todayIntake} />
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
}
