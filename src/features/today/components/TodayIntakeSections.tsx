import { View } from "react-native";
import { LayoutAnimationConfig } from "react-native-reanimated";

import { formatLateSectionTitle } from "@/features/today/utils/formatters";
import type { TodaySections } from "@/features/today/utils/todayTypes";
import { AnimatedIntakeItem } from "./AnimatedIntakeItem";
import { AnimatedIntakeSection } from "./AnimatedIntakeSection";
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
    <AnimatedIntakeItem key={next.intake.id}>
      <NextIntakeCard
        todayIntake={next}
        isDisabled={next.intake.id === validatingIntakeId}
        onTake={onTake}
        onSkip={onSkip}
      />
    </AnimatedIntakeItem>
  ) : null;
  const laterCards = later.map((todayIntake) => (
    <AnimatedIntakeItem key={todayIntake.intake.id}>
      <LaterIntakeCard
        todayIntake={todayIntake}
        isDisabled={todayIntake.intake.id === validatingIntakeId}
        onTake={onTake}
      />
    </AnimatedIntakeItem>
  ));

  return (
    <LayoutAnimationConfig skipEntering>
      <View style={styles.sections}>
        {hasLate ? (
          <AnimatedIntakeSection>
            {lateTitle ? <TodaySectionTitle title={lateTitle} /> : null}
            <View style={styles.list}>
              {late.map((todayIntake) => (
                <AnimatedIntakeItem key={todayIntake.intake.id}>
                  <LateIntakeCard
                    todayIntake={todayIntake}
                    isDisabled={todayIntake.intake.id === validatingIntakeId}
                    onTake={onTake}
                    onSkip={onSkip}
                  />
                </AnimatedIntakeItem>
              ))}
            </View>
          </AnimatedIntakeSection>
        ) : null}
        {hasLate && next ? (
          <AnimatedIntakeSection>
            <TodaySectionTitle title="Ensuite" />
            <View style={styles.list}>
              {nextCard}
              {laterCards}
            </View>
          </AnimatedIntakeSection>
        ) : null}
        {!hasLate && next ? (
          <AnimatedIntakeSection>
            <TodaySectionTitle title="Prochaine prise" />
            {nextCard}
          </AnimatedIntakeSection>
        ) : null}
        {!hasLate && later.length > 0 ? (
          <AnimatedIntakeSection>
            <TodaySectionTitle title="Plus tard" />
            <View style={styles.list}>{laterCards}</View>
          </AnimatedIntakeSection>
        ) : null}
        {earlier.length > 0 ? (
          <AnimatedIntakeSection>
            <TodaySectionTitle title="Déjà prise" />
            <View style={styles.list}>
              {earlier.map((todayIntake) => (
                <AnimatedIntakeItem key={todayIntake.intake.id}>
                  <EarlierIntakeCard todayIntake={todayIntake} />
                </AnimatedIntakeItem>
              ))}
            </View>
          </AnimatedIntakeSection>
        ) : null}
      </View>
    </LayoutAnimationConfig>
  );
}
