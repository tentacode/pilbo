import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text } from "@/design-system/components/Text/Text";

import { useLegendLayout } from "@/features/calendar/hooks/useLegendLayout";
import { styles } from "./CalendarLegend.styles";
import { CalendarLegendItem } from "./CalendarLegendItem";

export function CalendarLegend() {
  const { t } = useTranslation("calendar");
  const { onLayout, onLabelsMeasureLayout, hasTwoColumns } = useLegendLayout();
  const items = [
    { status: "taken", label: t("Pris") },
    { status: "late", label: t("En retard") },
    { status: "missed", label: t("Non pris") },
    { status: "skipped", label: t("Ignoré") },
    { status: "today", label: t("Aujourd'hui") },
  ] as const;

  return (
    <View testID="calendar-legend" onLayout={onLayout} style={styles.legend}>
      {items.map(({ status, label }) => (
        <View
          key={status}
          testID={`calendar-legend-${status}`}
          style={hasTwoColumns ? styles.halfCell : styles.fullCell}
        >
          <CalendarLegendItem status={status} label={label} />
        </View>
      ))}
      {/* Invisible copy of the labels without width constraint: its width is the longest label one. */}
      <View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.measureContainer}
      >
        <View testID="calendar-legend-measure" onLayout={onLabelsMeasureLayout}>
          {items.map(({ status, label }) => (
            <Text key={status} variant="help">
              {label}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}
