import { View } from "react-native";

import { Icon } from "@/design-system/components/Icon/Icon";
import { Text } from "@/design-system/components/Text/Text";
import { useThemeColors } from "@/design-system/hooks/useThemeColors";

import { useStyles } from "./RecurrenceSummary.styles";

type RecurrenceSummaryProps = {
  recurrence: string;
  startsOn: string | null;
};

export function RecurrenceSummary({ recurrence, startsOn }: RecurrenceSummaryProps) {
  const styles = useStyles();
  const themeColors = useThemeColors();
  return (
    <View
      accessible
      accessibilityRole="summary"
      accessibilityLabel={startsOn === null ? recurrence : `${recurrence}. ${startsOn}`}
      accessibilityLiveRegion="polite"
      style={styles.summary}
    >
      <Icon name="calendar" color={themeColors.ink} />
      <View style={styles.texts}>
        <Text variant="bodyBold">{recurrence}</Text>
        {startsOn === null ? null : (
          <Text variant="small" tone="secondary">
            {startsOn}
          </Text>
        )}
      </View>
    </View>
  );
}
