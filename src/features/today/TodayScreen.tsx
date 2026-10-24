import { View } from "react-native";

import { Screen } from "@/design-system/components/Screen/Screen";

import { AsNeededSection } from "./components/AsNeededSection";
import { TodayDoneState } from "./components/TodayDoneState";
import { TodayEmptyState } from "./components/TodayEmptyState";
import { TodayHeader } from "./components/TodayHeader";
import { RemindersDisabledNotice } from "./components/RemindersDisabledNotice";
import { TodayIntakeSections } from "./components/TodayIntakeSections";
import { useNotificationPermission } from "@/features/notifications/hooks/useNotificationPermission";
import { useAsNeededTaking } from "@/features/today/hooks/useAsNeededTaking";
import { useIntakeValidation } from "@/features/today/hooks/useIntakeValidation";
import { useTodayData } from "@/features/today/hooks/useTodayData";
import { styles } from "./TodayScreen.styles";

export function TodayScreen() {
  const { date, intakes, sections, asNeededMeds, isEmpty, upcomingIntake, isAllHandled, refresh } =
    useTodayData();
  const { validatingIntakeId, validate } = useIntakeValidation(intakes, refresh);
  const asNeededTaking = useAsNeededTaking(refresh);
  const { isGranted: remindersEnabled, request: enableReminders } = useNotificationPermission();

  const handleTake = (intakeId: string) => validate(intakeId, "taken");
  const handleSkip = (intakeId: string) => validate(intakeId, "skipped");

  return (
    <Screen>
      <TodayHeader date={date} />
      <View style={styles.content}>
        {remindersEnabled === false ? <RemindersDisabledNotice onEnable={enableReminders} /> : null}
        {isEmpty ? <TodayEmptyState upcomingIntake={upcomingIntake} /> : null}
        {isAllHandled ? <TodayDoneState /> : null}
        {isEmpty ? null : (
          <TodayIntakeSections
            sections={sections}
            validatingIntakeId={validatingIntakeId}
            onTake={handleTake}
            onSkip={handleSkip}
          />
        )}
        {asNeededMeds.length > 0 ? (
          <AsNeededSection
            asNeededMeds={asNeededMeds}
            onTake={asNeededTaking.take}
            onCancel={asNeededTaking.cancel}
          />
        ) : null}
      </View>
    </Screen>
  );
}
