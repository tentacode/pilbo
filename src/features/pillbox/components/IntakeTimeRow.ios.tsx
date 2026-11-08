import { DatePicker, Host } from "@expo/ui/swift-ui";
import {
  accessibilityLabel,
  datePickerStyle,
  labelsHidden,
  tint,
} from "@expo/ui/swift-ui/modifiers";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Text } from "@/design-system/components/Text/Text";
import { useThemeColors } from "@/design-system/hooks/useThemeColors";
import { type Intake } from "@/domain/intake";

import { FormGroup } from "./FormGroup";
import type { IntakeTimeRowProps } from "./IntakeTimeRow";
import { styles } from "./IntakeTimeRow.styles";
import { formatIntakeTime } from "@/shared/i18n/formatters";

function dateOf({ hour, minute }: Intake["time"]): Date {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date;
}

export function IntakeTimeRow({
  time,
  onChange,
  label,
  accessibilityLabel: customAccessibilityLabel,
}: IntakeTimeRowProps) {
  const themeColors = useThemeColors();
  const { t } = useTranslation("pillbox");
  return (
    <FormGroup>
      <View style={styles.row}>
        <Text variant="bodyBold" accessibilityElementsHidden>
          {label ?? t("Heure")}
        </Text>
        <Host matchContents colorScheme="light">
          <DatePicker
            selection={dateOf(time)}
            displayedComponents={["hourAndMinute"]}
            onDateChange={(date) => onChange({ hour: date.getHours(), minute: date.getMinutes() })}
            modifiers={[
              datePickerStyle("compact"),
              labelsHidden(),
              tint(themeColors.ink),
              accessibilityLabel(
                customAccessibilityLabel ?? t("Heure : {{time}}", { time: formatIntakeTime(time) }),
              ),
            ]}
          />
        </Host>
      </View>
    </FormGroup>
  );
}
