import { Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Icon } from "@/design-system/components/Icon/Icon";
import { Text } from "@/design-system/components/Text/Text";
import { colors, sizes } from "@/design-system/tokens";

import type { MedStockStatus } from "@/features/meds/utils/medsTypes";
import { AddMedRow } from "@/features/pillbox/components/AddMedRow";
import { SettingsSection } from "@/features/settings/components/SettingsSection";
import { StockProgressBar } from "@/features/stocks/components/StockProgressBar";
import { formatCoverage, formatPillCount } from "@/features/stocks/utils/formatters";
import { stockRatio } from "@/features/stocks/utils/stockForecast";
import { useLanguage } from "@/shared/i18n/hooks/useLanguage";
import { styles } from "./MedStockSection.styles";

type MedStockSectionProps = {
  stockStatus?: MedStockStatus;
  onOpenStock: () => void;
};

export function MedStockSection({ stockStatus, onOpenStock }: MedStockSectionProps) {
  const { t } = useTranslation("meds");
  return (
    <SettingsSection title={t("Stock")}>
      {stockStatus === undefined ? (
        <AddMedRow label={t("Suivre le stock")} hasTopBorder={false} onPress={onOpenStock} />
      ) : (
        <MedStockRow stockStatus={stockStatus} onPress={onOpenStock} />
      )}
    </SettingsSection>
  );
}

type MedStockRowProps = {
  stockStatus: MedStockStatus;
  onPress: () => void;
};

function MedStockRow({ stockStatus: { stock, forecast }, onPress }: MedStockRowProps) {
  const { t } = useTranslation("meds");
  const { t: translateStocks } = useTranslation("stocks");
  const language = useLanguage();
  const isLow = forecast.status === "low";
  const ratio = stockRatio(forecast);
  const pillCount = formatPillCount(translateStocks, stock.quantity);
  const coverage = formatCoverage(translateStocks, language, forecast);
  const [title, subtitle] =
    forecast.daysLeft === undefined
      ? [pillCount, t("Pas d’estimation en jours : ce médicament n’est pas planifié")]
      : [`${coverage.emphasis}${coverage.rest}`, pillCount];
  const accessibilityLabel = isLow
    ? t("Stock bas : {{title}}, {{subtitle}}", { title, subtitle })
    : t("Stock : {{title}}, {{subtitle}}", { title, subtitle });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.texts}>
        <View style={styles.title}>
          {isLow ? <Icon name="alert" size={sizes.iconSmall} color={colors.alertInk} /> : null}
          <Text variant="bodyBold" tone={isLow ? "alert" : "primary"} style={styles.titleText}>
            {title}
          </Text>
        </View>
        <Text variant="small" tone="secondary">
          {subtitle}
        </Text>
        {ratio === undefined ? null : (
          <View style={styles.bar}>
            <StockProgressBar ratio={ratio} isLow={isLow} />
          </View>
        )}
      </View>
      <Icon name="chevronRight" color={colors.inkSecondary} />
    </Pressable>
  );
}
