import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/design-system/components/Button/Button";
import { Text } from "@/design-system/components/Text/Text";
import { spacing } from "@/design-system/tokens";

import { formatTodayDate } from "@/features/today/utils/formatters";
import type { TodaySummary } from "@/features/today/utils/todayTypes";
import { styles } from "./TodayHeader.styles";
import { TodayHeaderDecoration } from "./TodayHeaderDecoration";

type TodayHeaderProps = {
  date: Date;
  summary?: TodaySummary | null;
  onAddUnscheduled: () => void;
};

export function TodayHeader({ date, summary, onAddUnscheduled }: TodayHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.header}>
      <View style={[styles.decoration, { top: -(insets.top + spacing.medium) }]}>
        <TodayHeaderDecoration />
      </View>
      <View style={styles.row}>
        <Text variant="small" tone="secondary" style={styles.date}>
          {formatTodayDate(date)}
        </Text>
        <Button
          label="Hors planning"
          variant="secondary"
          icon="plus"
          accessibilityLabel="Ajouter une prise hors planning"
          onPress={onAddUnscheduled}
        />
      </View>
      <Text variant="title" accessibilityRole="header" style={styles.title}>
        {"Aujourd'hui"}
      </Text>
      {summary ? (
        <Text
          variant="small"
          accessibilityLabel={summary.accessibilityLabel}
          style={styles.summary}
        >
          <Text variant="smallBold">{summary.progress}</Text>
          {summary.detail ? ` · ${summary.detail}` : null}
        </Text>
      ) : null}
    </View>
  );
}
