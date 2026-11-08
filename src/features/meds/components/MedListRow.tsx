import { Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Pill } from "@/design-system/components/Pill/Pill";
import { Text } from "@/design-system/components/Text/Text";
import { sizes } from "@/design-system/tokens";

import { useMedListRowLayout } from "@/features/meds/hooks/useMedListRowLayout";
import {
  formatMedRowAccessibilityLabel,
  formatPillAbbreviation,
} from "@/features/meds/utils/formatters";
import type { MedListItem } from "@/features/meds/utils/medsTypes";
import { MedListRowStock } from "./MedListRowStock";
import { useStyles } from "./MedListRow.styles";

type MedListRowProps = {
  item: MedListItem;
  onPress: () => void;
};

export function MedListRow({ item, onPress }: MedListRowProps) {
  const styles = useStyles();
  const { t } = useTranslation("meds");
  const { med, stockStatus } = item;
  const { onRowLayout, onTrailingLayout, isStacked } = useMedListRowLayout();
  const hasDaysLeft = stockStatus?.forecast.daysLeft !== undefined;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={formatMedRowAccessibilityLabel(t, item)}
      onLayout={onRowLayout}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <Pill design={med.design} displaySize={sizes.pillInPicker} />
      <View style={styles.texts}>
        <Text variant="bodyBold">
          {med.name}
          {med.strength === "" ? null : <Text> {med.strength}</Text>}
        </Text>
        {hasDaysLeft && stockStatus !== undefined ? (
          <Text variant="help" tone="secondary">
            {formatPillAbbreviation(t, stockStatus.stock.quantity)}
          </Text>
        ) : null}
        {isStacked ? <MedListRowStock stockStatus={stockStatus} isStacked /> : null}
      </View>
      {isStacked ? null : (
        <View onLayout={onTrailingLayout}>
          <MedListRowStock stockStatus={stockStatus} isStacked={false} />
        </View>
      )}
    </Pressable>
  );
}
