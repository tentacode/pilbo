import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/design-system/components/Button/Button";
import { Text } from "@/design-system/components/Text/Text";
import { spacing } from "@/design-system/tokens";

import { formatTodayDate } from "@/features/today/utils/formatters";
import { styles } from "./TodayHeader.styles";
import { TodayHeaderDecoration } from "./TodayHeaderDecoration";

type TodayHeaderProps = {
  date: Date;
  onAddUnscheduled: () => void;
};

export function TodayHeader({ date, onAddUnscheduled }: TodayHeaderProps) {
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
          label="Si besoin"
          variant="secondary"
          icon="plus"
          accessibilityLabel="Ajouter une prise au besoin"
          onPress={onAddUnscheduled}
        />
      </View>
      <Text variant="title" accessibilityRole="header" style={styles.title}>
        {"Aujourd'hui"}
      </Text>
    </View>
  );
}
