import { Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Icon } from "@/design-system/components/Icon/Icon";
import { Text } from "@/design-system/components/Text/Text";

import { styles } from "./AddMedRow.styles";

type AddMedRowProps = {
  onPress: () => void;
  label?: string;
  hasTopBorder?: boolean;
};

export function AddMedRow({ onPress, label, hasTopBorder = true }: AddMedRowProps) {
  const { t } = useTranslation("pillbox");
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        hasTopBorder && styles.topBorder,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.iconBadge}>
        <Icon name="plus" />
      </View>
      <Text variant="bodyBold" style={styles.label}>
        {label ?? t("Ajouter un médicament")}
      </Text>
    </Pressable>
  );
}
