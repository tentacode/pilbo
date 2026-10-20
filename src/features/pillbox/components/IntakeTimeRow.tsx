import { DatePicker, Host } from "@expo/ui/swift-ui";
import {
  accessibilityLabel,
  datePickerStyle,
  environment,
  labelsHidden,
  tint,
} from "@expo/ui/swift-ui/modifiers";
import { View } from "react-native";

import { Text } from "@/design-system/components/Text/Text";
import { colors } from "@/design-system/tokens";
import { formatIntakeTime, type Intake } from "@/domain/intake";

import { FormGroup } from "./FormGroup";
import { styles } from "./IntakeTimeRow.styles";

const PICKER_LOCALE = "fr-FR";

type IntakeTimeRowProps = {
  time: Intake["time"];
  onChange: (time: Intake["time"]) => void;
};

function dateOf({ hour, minute }: Intake["time"]): Date {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date;
}

export function IntakeTimeRow({ time, onChange }: IntakeTimeRowProps) {
  return (
    <FormGroup>
      <View style={styles.row}>
        <Text variant="bodyBold" accessibilityElementsHidden>
          Heure
        </Text>
        <Host matchContents colorScheme="light">
          <DatePicker
            selection={dateOf(time)}
            displayedComponents={["hourAndMinute"]}
            onDateChange={(date) => onChange({ hour: date.getHours(), minute: date.getMinutes() })}
            modifiers={[
              datePickerStyle("compact"),
              labelsHidden(),
              environment("locale", PICKER_LOCALE),
              tint(colors.ink),
              accessibilityLabel(`Heure : ${formatIntakeTime(time)}`),
            ]}
          />
        </Host>
      </View>
    </FormGroup>
  );
}
