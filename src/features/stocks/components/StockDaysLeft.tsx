import { Text } from "@/design-system/components/Text/Text";
import { useTranslation } from "react-i18next";

import { formatDaysLeft } from "@/features/stocks/utils/formatters";
import type { StockItem } from "@/features/stocks/utils/stockTypes";
import { styles } from "./StockDaysLeft.styles";

type StockDaysLeftProps = {
  stockItem: StockItem;
  isStacked: boolean;
};

export function StockDaysLeft({ stockItem, isStacked }: StockDaysLeftProps) {
  const { t } = useTranslation("stocks");
  const daysLeft = formatDaysLeft(t, stockItem);
  const alignment = isStacked ? styles.stacked : styles.trailing;

  if (daysLeft.kind === "text") {
    return (
      <Text variant="small" tone="secondary" style={alignment}>
        {daysLeft.text}
      </Text>
    );
  }
  return (
    <Text
      variant="mediumHeading"
      tone={stockItem.forecast.status === "low" ? "alert" : "primary"}
      style={alignment}
    >
      {daysLeft.count}{" "}
      <Text variant="small" tone="secondary">
        {daysLeft.unit}
      </Text>
    </Text>
  );
}
