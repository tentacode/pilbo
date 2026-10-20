import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text } from "@/design-system/components/Text/Text";
import { spacing } from "@/design-system/tokens";

import { formatTodayDate } from "@/features/today/utils/formatters";
import { styles } from "./TodayHeader.styles";
import { TodayHeaderDecoration } from "./TodayHeaderDecoration";

type TodayHeaderProps = {
  date: Date;
};

export function TodayHeader({ date }: TodayHeaderProps) {
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
      </View>
      <Text variant="title" accessibilityRole="header" style={styles.title}>
        {"Aujourd'hui"}
      </Text>
    </View>
  );
}
