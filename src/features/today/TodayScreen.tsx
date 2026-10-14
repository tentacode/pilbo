import { View } from "react-native";

import { Screen } from "@/design-system/components/Screen/Screen";

import { TodayDoneState } from "./components/TodayDoneState";
import { TodayEmptyState } from "./components/TodayEmptyState";
import { TodayHeader } from "./components/TodayHeader";
import { RemindersDisabledNotice } from "./components/RemindersDisabledNotice";
import { TodayIntakeSections } from "./components/TodayIntakeSections";
import { useIntakeValidation } from "@/features/today/hooks/useIntakeValidation";
import { useRemindersEnabled } from "@/features/today/hooks/useRemindersEnabled";
import { useTodayData } from "@/features/today/hooks/useTodayData";
import { styles } from "./TodayScreen.styles";

export function TodayScreen() {
  const { date, intakes, sections, summary, isEmpty, isAllHandled, refresh } = useTodayData();
  const { validatingIntakeId, validate } = useIntakeValidation(intakes, refresh);
  const remindersEnabled = useRemindersEnabled();

  const handleTake = (intakeId: string) => validate(intakeId, "taken");
  const handleSkip = (intakeId: string) => validate(intakeId, "skipped");
  const handleAddUnscheduled = () => {};

  return (
    <Screen>
      <TodayHeader date={date} summary={summary} onAddUnscheduled={handleAddUnscheduled} />
      <View style={styles.content}>
        {remindersEnabled === false ? <RemindersDisabledNotice /> : null}
        {isEmpty ? <TodayEmptyState /> : null}
        {isAllHandled ? <TodayDoneState /> : null}
        {isEmpty ? null : (
          <TodayIntakeSections
            sections={sections}
            validatingIntakeId={validatingIntakeId}
            onTake={handleTake}
            onSkip={handleSkip}
          />
        )}
      </View>
    </Screen>
  );
}
