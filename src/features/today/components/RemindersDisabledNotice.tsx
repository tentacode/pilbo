import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/design-system/components/Button/Button";
import { Text } from "@/design-system/components/Text/Text";

import { styles } from "./RemindersDisabledNotice.styles";

type RemindersDisabledNoticeProps = {
  onEnable: () => void;
};

export function RemindersDisabledNotice({ onEnable }: RemindersDisabledNoticeProps) {
  const { t } = useTranslation("today");
  return (
    <View style={styles.notice}>
      <Text variant="bodyBold" accessibilityRole="header">
        {t("Les rappels sont désactivés")}
      </Text>
      <Text variant="small" tone="secondary">
        {t("Activez les notifications pour recevoir vos rappels.")}
      </Text>
      <Button label={t("Activer les notifications")} variant="secondary" onPress={onEnable} />
    </View>
  );
}
