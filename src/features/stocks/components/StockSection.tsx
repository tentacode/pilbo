import { View } from "react-native";

import { Text } from "@/design-system/components/Text/Text";

import type { StockItem } from "@/features/stocks/utils/stockTypes";
import { StockCard } from "./StockCard";
import { styles } from "./StockSection.styles";

type StockSectionProps = {
  title: string;
  stockItems: StockItem[];
  onStockPress: (medId: string) => void;
};

export function StockSection({ title, stockItems, onStockPress }: StockSectionProps) {
  return (
    <View>
      <Text variant="heading" accessibilityRole="header" style={styles.heading}>
        {title}
      </Text>
      <View style={styles.list}>
        {stockItems.map((stockItem) => (
          <StockCard
            key={stockItem.med.id}
            stockItem={stockItem}
            onPress={() => onStockPress(stockItem.med.id)}
          />
        ))}
      </View>
    </View>
  );
}
