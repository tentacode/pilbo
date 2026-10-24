import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Icon } from "@/design-system/components/Icon/Icon";
import { Pill } from "@/design-system/components/Pill/Pill";
import { Text } from "@/design-system/components/Text/Text";
import { colors, sizes } from "@/design-system/tokens";
import { formatMedLabel } from "@/domain/med";

import { MedName } from "@/features/pillbox/components/MedName";
import { formatAsNeededTakenAt } from "@/features/today/utils/formatters";
import type { MedLogOfDay } from "@/features/today/utils/todayTypes";
import { styles } from "./TakenAsNeededRow.styles";

type TakenAsNeededRowProps = {
  medLog: MedLogOfDay;
  hasTopBorder: boolean;
};

export function TakenAsNeededRow({
  medLog: { med, takenAt },
  hasTopBorder,
}: TakenAsNeededRowProps) {
  const { t } = useTranslation("today");
  const takenText = formatAsNeededTakenAt(t, takenAt);
  return (
    <View
      accessible
      accessibilityLabel={[formatMedLabel(med), med.detail, takenText].filter(Boolean).join(", ")}
      style={[styles.row, hasTopBorder && styles.topBorder]}
    >
      <Pill design={med.design} displaySize={sizes.pillInRow} />
      <View style={styles.texts}>
        <MedName med={med} />
        <View style={styles.takenStatus}>
          <Icon name="checkCircle" size={sizes.iconSmall} color={colors.successInk} />
          <Text variant="smallBold" tone="success" style={styles.takenText}>
            {takenText}
          </Text>
        </View>
      </View>
    </View>
  );
}
