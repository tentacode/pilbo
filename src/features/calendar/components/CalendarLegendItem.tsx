import { View } from "react-native";

import { Icon } from "@/design-system/components/Icon/Icon";
import { Text } from "@/design-system/components/Text/Text";
import { useThemeColors } from "@/design-system/hooks/useThemeColors";
import { sizes } from "@/design-system/tokens";

import type { DayStatus } from "@/features/calendar/utils/calendarTypes";
import { useStyles } from "./CalendarLegendItem.styles";
import { DAY_STATUS_APPEARANCES, useDayStatusStyles } from "./dayStatusAppearances";

type CalendarLegendItemProps = {
  label: string;
  status: Exclude<DayStatus, "none"> | "today";
};

export function CalendarLegendItem({ label, status }: CalendarLegendItemProps) {
  const styles = useStyles();
  const dayStatusStyles = useDayStatusStyles();
  const themeColors = useThemeColors();
  const appearance = status === "today" ? null : DAY_STATUS_APPEARANCES[status];
  return (
    <View accessible accessibilityLabel={label} style={styles.item}>
      <View style={[styles.swatch, dayStatusStyles[status]]}>
        {appearance ? (
          <Icon
            name={appearance.icon}
            size={sizes.iconTiny}
            color={themeColors[appearance.color]}
          />
        ) : null}
      </View>
      <Text variant="help" style={styles.label}>
        {label}
      </Text>
    </View>
  );
}
