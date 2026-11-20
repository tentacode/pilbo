import { Pressable, View } from "react-native";
import Animated, { FadeIn, ReduceMotion } from "react-native-reanimated";
import { useTranslation } from "react-i18next";

import { Icon } from "@/design-system/components/Icon/Icon";
import { Text } from "@/design-system/components/Text/Text";
import { useThemeColors } from "@/design-system/hooks/useThemeColors";
import { duration } from "@/design-system/tokens";
import { toLocalDate } from "@/domain/intakeLog";

import {
  formatStartsOnAccessibilityLabel,
  formatStartsOnValue,
} from "@/features/pillbox/utils/recurrenceFormatters";
import { FormGroup } from "./FormGroup";
import { FormSection } from "./FormSection";
import { StartDatePicker } from "./StartDatePicker";
import { useStyles } from "./StartsOnField.styles";
import { useLanguage } from "@/shared/i18n/hooks/useLanguage";

const entering = FadeIn.duration(duration.short).reduceMotion(ReduceMotion.System);

type StartsOnFieldProps = {
  label?: string;
  help?: string;
  startsOn: string;
  today: Date;
  isExpanded: boolean;
  onToggle: () => void;
  onChange: (startsOn: string) => void;
};

export function StartsOnField({
  label,
  help,
  startsOn,
  today,
  isExpanded,
  onToggle,
  onChange,
}: StartsOnFieldProps) {
  const styles = useStyles();
  const themeColors = useThemeColors();
  const { t } = useTranslation("pillbox");
  const language = useLanguage();
  return (
    <FormSection label={label} help={help}>
      <FormGroup>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={formatStartsOnAccessibilityLabel(t, language, startsOn, today)}
          accessibilityState={{ expanded: isExpanded }}
          onPress={onToggle}
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}
        >
          <Text variant="bodyBold" style={styles.label}>
            {t("À partir du")}
          </Text>
          <View style={styles.value}>
            <Text variant="buttonSmall" style={styles.valueText}>
              {formatStartsOnValue(t, language, startsOn, today)}
            </Text>
            <Icon
              name={isExpanded ? "chevronUp" : "chevronDown"}
              color={themeColors.inkSecondary}
            />
          </View>
        </Pressable>
        {isExpanded ? (
          <Animated.View entering={entering}>
            <StartDatePicker startsOn={startsOn} today={toLocalDate(today)} onChange={onChange} />
          </Animated.View>
        ) : null}
      </FormGroup>
    </FormSection>
  );
}
