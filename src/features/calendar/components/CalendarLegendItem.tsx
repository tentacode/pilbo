import { View } from "react-native";

import { Icon } from "@/design-system/components/Icon/Icon";
import { Text } from "@/design-system/components/Text/Text";
import { sizes } from "@/design-system/tokens";

import type { DayStatus } from "@/features/calendar/utils/calendarTypes";
import { styles } from "./CalendarLegendItem.styles";
import { DAY_STATUS_APPEARANCES, dayStatusStyles } from "./dayStatusAppearances";

type CalendarLegendItemProps = {
  label: string;
  status: Exclude<DayStatus, "none"> | "today";
};

export function CalendarLegendItem({ label, status }: CalendarLegendItemProps) {
  const appearance = status === "today" ? null : DAY_STATUS_APPEARANCES[status];
  return (
    <View accessible accessibilityLabel={label} style={styles.item}>
      <View style={[styles.swatch, dayStatusStyles[status]]}>
        {appearance ? (
          <Icon name={appearance.icon} size={sizes.iconTiny} color={appearance.color} />
        ) : null}
      </View>
      <Text variant="help" style={styles.label}>
        {label}
      </Text>
    </View>
  );
}
