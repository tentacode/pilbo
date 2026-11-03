import { Pressable, View } from "react-native";

import { Icon } from "@/design-system/components/Icon/Icon";
import { Pill } from "@/design-system/components/Pill/Pill";
import { colors, sizes } from "@/design-system/tokens";
import { formatMedLabel, type Med } from "@/domain/med";

import { MedName } from "./MedName";
import { useStyles } from "./UnscheduledMedRow.styles";

type UnscheduledMedRowProps = {
  med: Med;
  hasTopBorder: boolean;
  onPress: () => void;
};

export function UnscheduledMedRow({ med, hasTopBorder, onPress }: UnscheduledMedRowProps) {
  const styles = useStyles();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={[formatMedLabel(med), med.detail].filter(Boolean).join(", ")}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        hasTopBorder && styles.topBorder,
        pressed && styles.pressed,
      ]}
    >
      <Pill design={med.design} displaySize={sizes.pillInRow} />
      <View style={styles.texts}>
        <MedName med={med} />
      </View>
      <Icon name="chevronRight" color={colors.inkSecondary} />
    </Pressable>
  );
}
