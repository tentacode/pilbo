import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text } from "@/design-system/components/Text/Text";
import { toLocalDate } from "@/domain/intakeLog";

import { formatDueDate } from "@/features/pillbox/utils/recurrenceFormatters";
import { FormGroup } from "./FormGroup";
import { useStyles } from "./UpcomingIntakeList.styles";
import { capitalize } from "@/shared/i18n/formatters";
import { useLanguage } from "@/shared/i18n/hooks/useLanguage";

type UpcomingIntakeListProps = {
  dates: Date[];
  today: Date;
};

export function UpcomingIntakeList({ dates, today }: UpcomingIntakeListProps) {
  const styles = useStyles();
  const { t } = useTranslation("pillbox");
  const language = useLanguage();
  return (
    <FormGroup>
      {dates.map((date, index) => {
        const isToday = toLocalDate(date) === toLocalDate(today);
        return (
          <View
            key={toLocalDate(date)}
            accessible
            style={[styles.row, index > 0 && styles.separatedRow]}
          >
            <Text variant="bodyBold" style={styles.date}>
              {capitalize(formatDueDate(date, today, language))}
            </Text>
            {isToday ? (
              <View style={styles.tag}>
                <Text variant="smallBold" tone="success">
                  {t("Aujourd'hui")}
                </Text>
              </View>
            ) : null}
          </View>
        );
      })}
    </FormGroup>
  );
}
