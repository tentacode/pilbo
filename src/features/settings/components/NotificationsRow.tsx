import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Icon } from "@/design-system/components/Icon/Icon";
import { Text } from "@/design-system/components/Text/Text";
import { colors, sizes } from "@/design-system/tokens";

import { useNotificationPermission } from "@/features/notifications/hooks/useNotificationPermission";

import { styles } from "./NotificationsRow.styles";
import { SettingsRow } from "./SettingsRow";

export function NotificationsRow() {
  const { t } = useTranslation("settings");
  const { isGranted, request } = useNotificationPermission();
  const label = t("Notifications");

  if (isGranted === null) {
    return <SettingsRow label={label} accessibilityLabel={label} />;
  }

  if (isGranted) {
    return (
      <SettingsRow label={label} accessibilityLabel={t("Notifications : autorisées")}>
        <View style={styles.granted}>
          <Icon name="check" size={sizes.iconSmall} color={colors.successInk} />
          <Text variant="body" tone="success">
            {t("Autorisées")}
          </Text>
        </View>
      </SettingsRow>
    );
  }

  return (
    <SettingsRow
      label={label}
      hasChevron
      onPress={request}
      accessibilityLabel={t("Notifications : activer")}
      accessibilityRole="button"
      accessibilityHint={t("Permet de recevoir les rappels de vos prises")}
    >
      <Text variant="body" tone="secondary">
        {t("Activer")}
      </Text>
    </SettingsRow>
  );
}
