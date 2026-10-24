import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { Text } from "@/design-system/components/Text/Text";
import { spacing } from "@/design-system/tokens";

import { formatTodayDate } from "@/features/today/utils/formatters";
import { styles } from "./TodayHeader.styles";
import { TodayHeaderDecoration } from "./TodayHeaderDecoration";
import { useLanguage } from "@/shared/i18n/hooks/useLanguage";

type TodayHeaderProps = {
  date: Date;
};

export function TodayHeader({ date }: TodayHeaderProps) {
  const { t } = useTranslation("today");
  const language = useLanguage();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.header}>
      <View style={[styles.decoration, { top: -(insets.top + spacing.medium) }]}>
        <TodayHeaderDecoration />
      </View>
      <View style={styles.row}>
        <Text variant="small" tone="secondary" style={styles.date}>
          {formatTodayDate(date, language)}
        </Text>
      </View>
      <Text variant="title" accessibilityRole="header" style={styles.title}>
        {t("Aujourd'hui")}
      </Text>
    </View>
  );
}
