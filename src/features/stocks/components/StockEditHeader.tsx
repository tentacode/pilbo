import { View } from "react-native";

import { Pill } from "@/design-system/components/Pill/Pill";
import { Text } from "@/design-system/components/Text/Text";
import { sizes } from "@/design-system/tokens";
import type { Med } from "@/domain/med";

import { styles } from "./StockEditHeader.styles";

type StockEditHeaderProps = {
  med: Med;
  subtitle: string;
  detail?: string;
};

export function StockEditHeader({ med, subtitle, detail }: StockEditHeaderProps) {
  return (
    <View style={styles.header}>
      <Pill design={med.design} displaySize={sizes.pillInHeader} />
      <View style={styles.texts}>
        <Text variant="largeHeading" accessibilityRole="header">
          {med.name}
          {med.strength === "" ? null : <Text variant="leadInline"> {med.strength}</Text>}
        </Text>
        <Text variant="small" tone="secondary">
          {detail === undefined ? subtitle : `${subtitle}\n${detail}`}
        </Text>
      </View>
    </View>
  );
}
