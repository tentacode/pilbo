import { Pressable, View } from "react-native";

import { Icon } from "@/design-system/components/Icon/Icon";
import { Text } from "@/design-system/components/Text/Text";

import { styles } from "./AddMedRow.styles";

export function AddMedRow() {
  return (
    <Pressable accessibilityRole="button" style={styles.row}>
      <View style={styles.iconBadge}>
        <Icon name="plus" />
      </View>
      <Text variant="bodyBold" style={styles.label}>
        Ajouter un médicament
      </Text>
    </Pressable>
  );
}
