import { View } from "react-native";

import { Screen } from "@/design-system/components/Screen/Screen";

import { TodayEmptyState } from "./components/TodayEmptyState";
import { TodayHeader } from "./components/TodayHeader";
import { TodayIntakeSections } from "./components/TodayIntakeSections";
import { useTodayData } from "@/features/today/hooks/useTodayData";
import { styles } from "./TodayScreen.styles";

export function TodayScreen() {
  const { date, sections, summary, isEmpty } = useTodayData();

  const handleTake = () => {};
  const handleSkip = () => {};
  const handleAddUnscheduled = () => {};

  return (
    <Screen>
      <TodayHeader date={date} summary={summary} onAddUnscheduled={handleAddUnscheduled} />
      <View style={styles.content}>
        {isEmpty ? (
          <TodayEmptyState />
        ) : (
          <TodayIntakeSections sections={sections} onTake={handleTake} onSkip={handleSkip} />
        )}
      </View>
    </Screen>
  );
}
