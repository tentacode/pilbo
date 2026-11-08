import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Icon } from "@/design-system/components/Icon/Icon";
import { Text } from "@/design-system/components/Text/Text";
import { useThemeColors } from "@/design-system/hooks/useThemeColors";
import { sizes } from "@/design-system/tokens";

import { formatDayUnit, formatPillUnitAbbreviation } from "@/features/meds/utils/formatters";
import type { MedStockStatus } from "@/features/meds/utils/medsTypes";
import { StockProgressBar } from "@/features/stocks/components/StockProgressBar";
import { stockRatio } from "@/features/stocks/utils/stockForecast";
import { styles } from "./MedListRowStock.styles";

type MedListRowStockProps = {
  stockStatus?: MedStockStatus;
  isStacked: boolean;
};

export function MedListRowStock({ stockStatus, isStacked }: MedListRowStockProps) {
  const themeColors = useThemeColors();
  const { t } = useTranslation("meds");
  if (stockStatus === undefined) {
    return (
      <Text variant="help" tone="secondary">
        {t("Non suivi")}
      </Text>
    );
  }
  const { stock, forecast } = stockStatus;
  const isLow = forecast.status === "low";
  const ratio = stockRatio(forecast);
  const [count, unit] =
    forecast.daysLeft === undefined
      ? [stock.quantity, formatPillUnitAbbreviation(t, stock.quantity)]
      : [forecast.daysLeft, formatDayUnit(t, forecast.daysLeft)];

  return (
    <View style={[styles.container, isStacked && styles.stackedContainer]}>
      <View style={styles.count}>
        {isLow ? <Icon name="alert" size={sizes.iconSmall} color={themeColors.alertInk} /> : null}
        <Text variant="heading" tone={isLow ? "alert" : "primary"} style={styles.number}>
          {count}
        </Text>
        <Text variant="help" tone={isLow ? "alert" : "secondary"}>
          {unit}
        </Text>
      </View>
      {ratio === undefined ? null : <StockProgressBar ratio={ratio} isLow={isLow} isCompact />}
    </View>
  );
}
