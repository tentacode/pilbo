import { Pressable } from "react-native";
import { useTranslation } from "react-i18next";

import { Icon } from "@/design-system/components/Icon/Icon";
import { Text } from "@/design-system/components/Text/Text";
import { colors } from "@/design-system/tokens";
import type { Intake } from "@/domain/intake";

import { formatMedIntakeDetails } from "@/features/meds/utils/formatters";
import { formatIntakeDays } from "@/features/pillbox/utils/formatters";
import { SettingsSection } from "@/features/settings/components/SettingsSection";
import { formatIntakeTime } from "@/shared/i18n/formatters";
import { useLanguage } from "@/shared/i18n/hooks/useLanguage";
import { styles } from "./MedIntakesSection.styles";

type MedIntakesSectionProps = {
  medId: string;
  intakes: Intake[];
  onOpenIntake: (intakeId: string) => void;
};

export function MedIntakesSection({ medId, intakes, onOpenIntake }: MedIntakesSectionProps) {
  const { t } = useTranslation("meds");
  const { t: translatePillbox } = useTranslation("pillbox");
  const language = useLanguage();
  if (intakes.length === 0) {
    return null;
  }
  return (
    <SettingsSection title={t("Dans le pilulier")}>
      {intakes.map((intake) => {
        const days = formatIntakeDays(translatePillbox, language, intake.days, "short");
        const time = formatIntakeTime(intake.time);
        const details = formatMedIntakeDetails(t, { intake, days, medId });
        return (
          <Pressable
            key={intake.id}
            accessibilityRole="button"
            accessibilityLabel={`${time}, ${details}`}
            accessibilityHint={t("Ouvre la prise.")}
            onPress={() => onOpenIntake(intake.id)}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          >
            <Text style={styles.text}>
              <Text variant="bodyBold">{time}</Text> · {details}
            </Text>
            <Icon name="chevronRight" color={colors.inkSecondary} />
          </Pressable>
        );
      })}
    </SettingsSection>
  );
}
