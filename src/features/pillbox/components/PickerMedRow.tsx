import { Pressable, View } from "react-native";

import { Icon } from "@/design-system/components/Icon/Icon";
import { Pill } from "@/design-system/components/Pill/Pill";
import { Text } from "@/design-system/components/Text/Text";
import { colors, sizes } from "@/design-system/tokens";
import { formatMedLabel, type Med } from "@/domain/med";

import { MedName } from "./MedName";
import { styles } from "./PickerMedRow.styles";

type PickerMedRowProps = {
  med: Med;
  hasTopBorder: boolean;
  actionLabel?: string;
  unavailableLabel?: string;
  statusLabel?: string;
  onPress: () => void;
};

export function PickerMedRow({
  med,
  hasTopBorder,
  actionLabel,
  unavailableLabel,
  statusLabel,
  onPress,
}: PickerMedRowProps) {
  const isUnavailable = unavailableLabel !== undefined;
  const label = unavailableLabel ?? statusLabel;
  const details = [formatMedLabel(med), med.detail, label].filter(Boolean).join(", ");
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        isUnavailable || actionLabel === undefined ? details : `${actionLabel} ${details}`
      }
      accessibilityState={{ disabled: isUnavailable }}
      disabled={isUnavailable}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        hasTopBorder && styles.topBorder,
        pressed && styles.pressed,
      ]}
    >
      <Pill design={med.design} displaySize={sizes.pillInPicker} />
      <View style={styles.texts}>
        <MedName med={med} tone={isUnavailable ? "secondary" : "primary"} />
      </View>
      {label !== undefined ? (
        <View style={styles.status}>
          <Icon name="check" size={sizes.iconSmall} color={colors.inkSecondary} />
          <Text variant="small" tone="secondary">
            {label}
          </Text>
        </View>
      ) : (
        <View style={styles.plusBadge}>
          <Icon name="plus" />
        </View>
      )}
    </Pressable>
  );
}
