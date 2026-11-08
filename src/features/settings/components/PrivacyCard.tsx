import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { Icon } from "@/design-system/components/Icon/Icon";
import { Text } from "@/design-system/components/Text/Text";
import { useThemeColors } from "@/design-system/hooks/useThemeColors";

import { useStyles } from "./PrivacyCard.styles";

export function PrivacyCard() {
  const styles = useStyles();
  const themeColors = useThemeColors();
  const { t } = useTranslation("settings");
  return (
    <View style={styles.card}>
      <View style={styles.iconBadge}>
        <Icon name="lock" color={themeColors.turquoiseInk} />
      </View>
      <Text variant="small" style={styles.text}>
        {t(
          "Tout est enregistré sur ce téléphone. Rien n'est envoyé ailleurs. Si vous supprimez Pilbo, vos données disparaissent avec elle.",
        )}
      </Text>
    </View>
  );
}
