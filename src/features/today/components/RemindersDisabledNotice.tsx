import { View } from "react-native";

import { Button } from "@/design-system/components/Button/Button";
import { Text } from "@/design-system/components/Text/Text";

import { styles } from "./RemindersDisabledNotice.styles";

type RemindersDisabledNoticeProps = {
  onEnable: () => void;
};

export function RemindersDisabledNotice({ onEnable }: RemindersDisabledNoticeProps) {
  return (
    <View style={styles.notice}>
      <Text variant="bodyBold" accessibilityRole="header">
        Les rappels sont désactivés
      </Text>
      <Text variant="small" tone="secondary">
        Activez les notifications pour recevoir vos rappels.
      </Text>
      <Button label="Activer les notifications" variant="secondary" onPress={onEnable} />
    </View>
  );
}
