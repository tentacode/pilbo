import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";

import { Sheet } from "@/design-system/components/Sheet/Sheet";
import { fromLocalDate, toLocalDate } from "@/domain/intakeLog";
import { formatFullDate } from "@/shared/i18n/formatters";

import { PastDayContent } from "./components/PastDayContent";
import { TodayContent } from "./components/TodayContent";
import { useCurrentMinute } from "@/features/today/hooks/useCurrentMinute";
import { useLanguage } from "@/shared/i18n/hooks/useLanguage";

export function DayScreen() {
  const { t } = useTranslation("today");
  const language = useLanguage();
  const { date } = useLocalSearchParams<{ date: string }>();
  const today = toLocalDate(useCurrentMinute());

  return (
    <Sheet
      title={formatFullDate(fromLocalDate(date), language)}
      leftAction={{ label: t("Fermer"), onPress: () => router.back() }}
    >
      {date < today ? <PastDayContent localDate={date} /> : <TodayContent />}
    </Sheet>
  );
}
