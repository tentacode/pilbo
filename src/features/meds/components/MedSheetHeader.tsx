import { Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/design-system/components/Button/Button";
import { Icon } from "@/design-system/components/Icon/Icon";
import { Pill } from "@/design-system/components/Pill/Pill";
import { Text } from "@/design-system/components/Text/Text";
import { colors, sizes } from "@/design-system/tokens";
import type { Med } from "@/domain/med";

import { useStyles } from "./MedSheetHeader.styles";

type MedSheetHeaderProps = {
  med: Med;
  onEditAppearance: () => void;
  onEdit: () => void;
};

export function MedSheetHeader({ med, onEditAppearance, onEdit }: MedSheetHeaderProps) {
  const styles = useStyles();
  const { t } = useTranslation("meds");
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("Modifier l’apparence de la pilule")}
        onPress={onEditAppearance}
        style={({ pressed }) => [styles.hero, pressed && styles.pressed]}
      >
        <Pill design={med.design} displaySize={sizes.pillPreview} />
        <View style={styles.badge}>
          <Icon name="pencil" size={sizes.iconSmall} color={colors.onInk} />
        </View>
      </Pressable>
      <Text variant="largeHeading" accessibilityRole="header" style={styles.centered}>
        {med.name}
        {med.strength === "" ? null : <Text variant="lead"> {med.strength}</Text>}
      </Text>
      {med.detail === "" ? null : (
        <Text variant="small" tone="secondary" style={styles.centered}>
          {med.detail}
        </Text>
      )}
      <Button
        label={t("Modifier")}
        accessibilityLabel={t("Modifier le médicament")}
        variant="text"
        icon="pencil"
        onPress={onEdit}
      />
    </View>
  );
}
