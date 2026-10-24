import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text } from "@/design-system/components/Text/Text";

import { formatUpcomingIntakeSentence } from "@/features/today/utils/formatters";
import type { UpcomingIntake } from "@/features/today/utils/todayTypes";
import { TodayEmptyIllustration } from "./TodayEmptyIllustration";
import { styles } from "./TodayEmptyState.styles";
import { useLanguage } from "@/shared/i18n/hooks/useLanguage";

type TodayEmptyStateProps = {
  upcomingIntake: UpcomingIntake | null;
};

export function TodayEmptyState({ upcomingIntake }: TodayEmptyStateProps) {
  const { t } = useTranslation("today");
  const language = useLanguage();
  const quietDay = t("Une journée tranquille côté pilulier.");
  const description = upcomingIntake
    ? `${quietDay} ${formatUpcomingIntakeSentence(t, language, upcomingIntake)}`
    : quietDay;

  return (
    <View style={styles.card}>
      <TodayEmptyIllustration />
      <Text variant="heading" accessibilityRole="header" style={styles.text}>
        {t("Rien à prendre aujourd'hui")}
      </Text>
      <Text tone="secondary" style={styles.text}>
        {description}
      </Text>
    </View>
  );
}
