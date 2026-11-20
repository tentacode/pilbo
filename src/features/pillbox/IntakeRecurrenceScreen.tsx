import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { SegmentedControl } from "@/design-system/components/SegmentedControl/SegmentedControl";
import { Sheet } from "@/design-system/components/Sheet/Sheet";
import type { IntakeFrequency } from "@/domain/intake";

import { FormSection } from "./components/FormSection";
import { MonthlyRecurrenceFields } from "./components/MonthlyRecurrenceFields";
import { RecurrenceSummary } from "./components/RecurrenceSummary";
import { WeekdayRecurrenceFields } from "./components/WeekdayRecurrenceFields";
import { useIntakeDraft } from "./hooks/useIntakeDraft";
import { recurrenceOf } from "./utils/intakeDraft";
import { formatRecurrence, formatStartsOn } from "./utils/recurrenceFormatters";
import { styles } from "./IntakeRecurrenceScreen.styles";
import { formatIntakeTime } from "@/shared/i18n/formatters";
import { useLanguage } from "@/shared/i18n/hooks/useLanguage";

export function IntakeRecurrenceScreen() {
  const { t } = useTranslation("pillbox");
  const language = useLanguage();
  const intakeDraft = useIntakeDraft();
  const { draft, initialDraft } = intakeDraft;
  const [today] = useState(() => new Date());
  const recurrence = recurrenceOf(draft);
  const frequencyOptions: { value: IntakeFrequency; label: string }[] = [
    { value: "daily", label: t("Jour") },
    { value: "weekly", label: t("Semaine") },
    { value: "monthly", label: t("Mois") },
  ];

  return (
    <Sheet
      title={t("Quand prendre mes médicaments")}
      leftAction={{
        label:
          initialDraft.intakeId === undefined
            ? t("Nouvelle prise")
            : t("Prise de {{time}}", { time: formatIntakeTime(draft.time) }),
        icon: "chevronLeft",
        onPress: () => router.back(),
      }}
      footer={
        <RecurrenceSummary
          recurrence={formatRecurrence(t, language, recurrence)}
          startsOn={
            draft.frequency === "daily"
              ? null
              : formatStartsOn(t, language, recurrence.startsOn, today)
          }
        />
      }
    >
      <View style={styles.content}>
        <FormSection label={t("Rythme")}>
          <SegmentedControl
            options={frequencyOptions}
            selectedValue={draft.frequency}
            onChange={intakeDraft.setFrequency}
            accessibilityLabel={t("Rythme")}
          />
        </FormSection>
        {draft.frequency === "monthly" ? (
          <MonthlyRecurrenceFields
            recurrence={recurrence}
            today={today}
            onIntervalChange={intakeDraft.setInterval}
            onStartsOnChange={intakeDraft.setStartsOn}
          />
        ) : (
          <WeekdayRecurrenceFields
            recurrence={recurrence}
            today={today}
            onDayPress={intakeDraft.toggleDay}
            onIntervalChange={intakeDraft.setInterval}
            onStartsOnChange={intakeDraft.setStartsOn}
          />
        )}
      </View>
    </Sheet>
  );
}
