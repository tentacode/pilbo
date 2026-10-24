import { View } from "react-native";

import { Button } from "@/design-system/components/Button/Button";
import { Icon } from "@/design-system/components/Icon/Icon";
import { Pill } from "@/design-system/components/Pill/Pill";
import { Text } from "@/design-system/components/Text/Text";
import { colors, sizes } from "@/design-system/tokens";
import { formatMedLabel } from "@/domain/med";

import { MedName } from "@/features/pillbox/components/MedName";
import { formatAsNeededTakenAt, formatTakenTime } from "@/features/today/utils/formatters";
import type { AsNeededMedOfDay } from "@/features/today/utils/todayTypes";
import { styles } from "./AsNeededMedRow.styles";

type AsNeededMedRowProps = AsNeededMedOfDay & {
  hasTopBorder: boolean;
  onTake: () => void;
  onCancel: () => void;
};

export function AsNeededMedRow({
  med,
  lastTakenAt,
  hasTopBorder,
  onTake,
  onCancel,
}: AsNeededMedRowProps) {
  const label = formatMedLabel(med);
  return (
    <View style={[styles.row, hasTopBorder && styles.topBorder]}>
      <View style={styles.med}>
        <View
          accessible
          accessibilityLabel={[label, med.detail].filter(Boolean).join(", ")}
          style={styles.medInfo}
        >
          <Pill design={med.design} displaySize={sizes.pillInRow} />
          <View style={styles.texts}>
            <MedName med={med} />
          </View>
        </View>
        <Button
          label="Prendre"
          variant="secondary"
          accessibilityLabel={`Prendre ${label}`}
          onPress={onTake}
        />
      </View>
      {lastTakenAt === undefined ? null : (
        <View style={styles.taken}>
          <View style={styles.takenStatus}>
            <Icon name="checkCircle" size={sizes.iconSmall} color={colors.successInk} />
            <Text variant="smallBold" tone="success">
              {formatAsNeededTakenAt(lastTakenAt)}
            </Text>
          </View>
          <Button
            label="Annuler"
            variant="text"
            accessibilityLabel={`Annuler la prise de ${label} de ${formatTakenTime(lastTakenAt)}`}
            onPress={onCancel}
          />
        </View>
      )}
    </View>
  );
}
