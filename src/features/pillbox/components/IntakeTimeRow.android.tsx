import { Host, TimePickerDialog, type TimePickerElementColors } from "@expo/ui/jetpack-compose";
import { useState } from "react";
import { useColorScheme, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/design-system/components/Button/Button";
import { Text } from "@/design-system/components/Text/Text";
import { useThemeColors } from "@/design-system/hooks/useThemeColors";
import type { ThemeColors } from "@/design-system/tokens";
import { type Intake } from "@/domain/intake";

import { FormGroup } from "./FormGroup";
import type { IntakeTimeRowProps } from "./IntakeTimeRow";
import { styles } from "./IntakeTimeRow.styles";
import { formatIntakeTime, uses24HourClock } from "@/shared/i18n/formatters";

function dateOf({ hour, minute }: Intake["time"]): Date {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date;
}

function timePickerColors(themeColors: ThemeColors): TimePickerElementColors {
  return {
    containerColor: themeColors.surface,
    clockDialColor: themeColors.fill,
    clockDialSelectedContentColor: themeColors.onInk,
    clockDialUnselectedContentColor: themeColors.ink,
    selectorColor: themeColors.ink,
    timeSelectorSelectedContainerColor: themeColors.lavender,
    timeSelectorSelectedContentColor: themeColors.onAccent,
    timeSelectorUnselectedContainerColor: themeColors.fill,
    timeSelectorUnselectedContentColor: themeColors.ink,
    periodSelectorBorderColor: themeColors.lineStrong,
    periodSelectorSelectedContainerColor: themeColors.lavender,
    periodSelectorSelectedContentColor: themeColors.onAccent,
    periodSelectorUnselectedContainerColor: themeColors.surface,
    periodSelectorUnselectedContentColor: themeColors.inkSecondary,
  };
}

export function IntakeTimeRow({
  time,
  onChange,
  label,
  accessibilityLabel: customAccessibilityLabel,
}: IntakeTimeRowProps) {
  const themeColors = useThemeColors();
  const colorScheme = useColorScheme();
  const { t } = useTranslation("pillbox");
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const formattedTime = formatIntakeTime(time);
  return (
    <FormGroup>
      <View style={styles.row}>
        <Text variant="bodyBold" importantForAccessibility="no">
          {label ?? t("Heure")}
        </Text>
        <Button
          variant="secondary"
          label={formattedTime}
          accessibilityLabel={
            customAccessibilityLabel ?? t("Heure : {{time}}", { time: formattedTime })
          }
          onPress={() => setIsDialogVisible(true)}
        />
      </View>
      {isDialogVisible ? (
        <Host matchContents colorScheme={colorScheme}>
          <TimePickerDialog
            initialDate={dateOf(time).toISOString()}
            is24Hour={uses24HourClock()}
            color={themeColors.ink}
            elementColors={timePickerColors(themeColors)}
            confirmButtonLabel={t("OK")}
            dismissButtonLabel={t("Annuler")}
            onDateSelected={(date) => {
              setIsDialogVisible(false);
              onChange({ hour: date.getHours(), minute: date.getMinutes() });
            }}
            onDismissRequest={() => setIsDialogVisible(false)}
          />
        </Host>
      ) : null}
    </FormGroup>
  );
}
