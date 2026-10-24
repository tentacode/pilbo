import { View } from "react-native";
import { useTranslation } from "react-i18next";

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
import { useLanguage } from "@/shared/i18n/hooks/useLanguage";

type StockSummaryCardProps = {
  med: Med;
  quantity: number;
  forecast: StockForecast;
  ratio: number;
};

export function StockSummaryCard({ med, quantity, forecast, ratio }: StockSummaryCardProps) {
  const { t } = useTranslation("stocks");
  const language = useLanguage();
  const isLow = forecast.status === "low";
  const statusTexts = { low: t("Stock bas"), sufficient: t("Suffisant") };
  const statusText = forecast.status === "noSchedule" ? undefined : statusTexts[forecast.status];
  const coverage = formatCoverage(t, language, med, forecast);
  const pillCount = formatPillCount(t, quantity);

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
          <Text tone="secondary">{formatPillUnit(t, quantity)}</Text>
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
