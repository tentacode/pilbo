import { Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Pill } from "@/design-system/components/Pill/Pill";
import { Text } from "@/design-system/components/Text/Text";
import { sizes } from "@/design-system/tokens";

import { useStockCardLayout } from "@/features/stocks/hooks/useStockCardLayout";
import {
  formatLowStockMention,
  formatPillCount,
  formatStockCardAccessibilityLabel,
} from "@/features/stocks/utils/formatters";
import { stockRatio } from "@/features/stocks/utils/stockForecast";
import type { StockItem } from "@/features/stocks/utils/stockTypes";
import { styles } from "./StockCard.styles";
import { StockDaysLeft } from "./StockDaysLeft";
import { StockMedName } from "./StockMedName";
import { StockProgressBar } from "./StockProgressBar";
import { StockStatusLabel } from "./StockStatusLabel";
import { useLanguage } from "@/shared/i18n/hooks/useLanguage";

type StockCardProps = {
  stockItem: StockItem;
  onPress: () => void;
};

export function StockCard({ stockItem, onPress }: StockCardProps) {
  const { t } = useTranslation("stocks");
  const language = useLanguage();
  const { med, stock, forecast } = stockItem;
  const isLow = forecast.status === "low";
  const { onRowLayout, onTrailingLayout, isStacked } = useStockCardLayout();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={formatStockCardAccessibilityLabel(t, language, stockItem)}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        isLow && styles.lowCard,
        pressed && (isLow ? styles.lowPressed : styles.pressed),
      ]}
    >
      <View onLayout={onRowLayout} style={[styles.row, isStacked && styles.stackedRow]}>
        <Pill design={med.design} displaySize={sizes.pillInStockCard} />
        <View style={[styles.texts, isStacked && styles.stackedTexts]}>
          <StockMedName med={med} />
          <Text variant="small" tone="secondary">
            {formatPillCount(t, stock.quantity)}
          </Text>
          {isStacked ? <StockDaysLeft stockItem={stockItem} isStacked /> : null}
        </View>
        {isStacked ? null : (
          <View onLayout={onTrailingLayout}>
            <StockDaysLeft stockItem={stockItem} isStacked={false} />
          </View>
        )}
      </View>
      <StockProgressBar ratio={stockRatio(stock)} isLow={isLow} />
      {isLow ? (
        <StockStatusLabel text={formatLowStockMention(t, language, stockItem)} isLow />
      ) : null}
    </Pressable>
  );
}
