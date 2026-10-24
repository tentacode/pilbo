import { View } from "react-native";

import { Text } from "@/design-system/components/Text/Text";
import type { Med } from "@/domain/med";

import {
  formatCoverage,
  formatPillCount,
  formatPillUnit,
} from "@/features/stocks/utils/formatters";
import type { StockForecast } from "@/features/stocks/utils/stockForecast";
import { StockProgressBar } from "./StockProgressBar";
import { StockStatusLabel } from "./StockStatusLabel";
import { styles } from "./StockSummaryCard.styles";

type StockSummaryCardProps = {
  med: Med;
  quantity: number;
  forecast: StockForecast;
  ratio: number;
};

const STATUS_TEXTS = { low: "Stock bas", sufficient: "Suffisant" } as const;

export function StockSummaryCard({ med, quantity, forecast, ratio }: StockSummaryCardProps) {
  const isLow = forecast.status === "low";
  const statusText = forecast.status === "noSchedule" ? undefined : STATUS_TEXTS[forecast.status];
  const coverage = formatCoverage(med, forecast);
  const pillCount = formatPillCount(quantity);

  return (
    <View
      accessible
      accessibilityLabel={[pillCount, statusText, `${coverage.emphasis}${coverage.rest}`]
        .filter(Boolean)
        .join(", ")}
      style={[styles.card, isLow && styles.lowCard]}
    >
      <View style={styles.top}>
        <View style={styles.quantity}>
          <Text variant="bigNumber" tone={isLow ? "alert" : "primary"}>
            {quantity}
          </Text>
          <Text tone="secondary">{formatPillUnit(quantity)}</Text>
        </View>
        {statusText === undefined ? null : <StockStatusLabel text={statusText} isLow={isLow} />}
      </View>
      <Text>
        <Text variant="bodyBold">{coverage.emphasis}</Text>
        {coverage.rest}
      </Text>
      <StockProgressBar ratio={ratio} isLow={isLow} />
    </View>
  );
}
