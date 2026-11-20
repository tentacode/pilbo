import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text } from "@/design-system/components/Text/Text";
import { maximumFontScale } from "@/design-system/tokens";
import { toLocalDate } from "@/domain/intakeLog";

import { formatWeekdayHeaders } from "@/features/calendar/utils/formatters";
import {
  formatWeeklyPreviewAccessibilityLabel,
  formatWeekRange,
} from "@/features/pillbox/utils/recurrenceFormatters";
import type { PreviewWeek } from "@/features/pillbox/utils/weeklyPreview";
import { FormGroup } from "./FormGroup";
import { useStyles } from "./WeeklyPreview.styles";
import { useLanguage } from "@/shared/i18n/hooks/useLanguage";

type WeeklyPreviewProps = {
  weeks: PreviewWeek[];
};

export function WeeklyPreview({ weeks }: WeeklyPreviewProps) {
  const styles = useStyles();
  const { t } = useTranslation("pillbox");
  const language = useLanguage();
  return (
    <View accessible accessibilityLabel={formatWeeklyPreviewAccessibilityLabel(t, language, weeks)}>
      <FormGroup>
        <View style={styles.header} accessibilityElementsHidden>
          <View style={styles.label} />
          {formatWeekdayHeaders(language).map((weekday) => (
            <Text
              key={weekday}
              variant="helpBold"
              tone="secondary"
              maxFontSizeMultiplier={maximumFontScale.calendarGrid}
              style={styles.weekday}
            >
              {weekday}
            </Text>
          ))}
        </View>
        {weeks.map((week) => (
          <View
            key={toLocalDate(week.monday)}
            accessibilityElementsHidden
            style={[styles.week, !week.isActive && styles.pausedWeek]}
          >
            <View style={styles.label}>
              <Text
                variant="helpBold"
                tone="secondary"
                maxFontSizeMultiplier={maximumFontScale.calendarGrid}
              >
                {formatWeekRange(week.monday, language)}
              </Text>
              {week.isActive ? null : (
                <Text
                  variant="help"
                  tone="secondary"
                  maxFontSizeMultiplier={maximumFontScale.calendarGrid}
                >
                  {t("Pause")}
                </Text>
              )}
            </View>
            {week.days.map(({ date, isDue }) => (
              <View key={date.getDate()} style={styles.slot}>
                <View style={[styles.day, isDue && styles.dueDay]}>
                  <Text
                    variant={isDue ? "smallBold" : "small"}
                    tone={isDue ? "onInk" : "secondary"}
                    maxFontSizeMultiplier={maximumFontScale.calendarGrid}
                    style={styles.dayNumber}
                  >
                    {date.getDate()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </FormGroup>
    </View>
  );
}
