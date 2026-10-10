import { Pressable, View } from "react-native";

import { Icon } from "@/design-system/components/Icon/Icon";
import { Pill } from "@/design-system/components/Pill/Pill";
import { Text } from "@/design-system/components/Text/Text";
import { colors, sizes } from "@/design-system/tokens";
import type { Med } from "@/domain/med";

import { styles } from "./UnscheduledMedRow.styles";

const AS_NEEDED = "Si besoin";

type UnscheduledMedRowProps = {
  med: Med;
};

export function UnscheduledMedRow({ med }: UnscheduledMedRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${med.name} ${med.strength}, ${AS_NEEDED}`}
      style={styles.row}
    >
      <Pill design={med.design} displaySize={sizes.pillInRow} />
      <View style={styles.texts}>
        <Text variant="bodyBold">
          {med.name} <Text>{med.strength}</Text>
        </Text>
        <Text variant="small" tone="secondary">
          {AS_NEEDED}
        </Text>
      </View>
      <Icon name="chevronRight" color={colors.inkSecondary} />
    </Pressable>
  );
}
