import { View } from "react-native";

import { Icon } from "@/design-system/components/Icon/Icon";
import { Text } from "@/design-system/components/Text/Text";
import { colors } from "@/design-system/tokens";

import { styles } from "./PrivacyCard.styles";

const PRIVACY_TEXT =
  "Tout est enregistré sur ce téléphone. Rien n'est envoyé ailleurs. Si vous supprimez Pilbo, vos données disparaissent avec elle.";

export function PrivacyCard() {
  return (
    <View style={styles.card}>
      <View style={styles.iconBadge}>
        <Icon name="lock" color={colors.turquoiseInk} />
      </View>
      <Text variant="small" style={styles.text}>
        {PRIVACY_TEXT}
      </Text>
    </View>
  );
}
