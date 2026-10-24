import { Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/design-system/components/Button/Button";
import { Icon } from "@/design-system/components/Icon/Icon";
import { Pill } from "@/design-system/components/Pill/Pill";
import { Text } from "@/design-system/components/Text/Text";
import { colors, sizes } from "@/design-system/tokens";
import { playPressHaptic } from "@/design-system/utils/playPressHaptic";
import type { PillDesign } from "@/domain/med";

import {
  formatPillDescription,
  formatPillDescriptionParts,
} from "@/features/pillbox/utils/formatters";
import { styles } from "./MedAppearanceBlock.styles";

type MedAppearanceBlockProps = {
  design: PillDesign;
  onEdit: () => void;
};

export function MedAppearanceBlock({ design, onEdit }: MedAppearanceBlockProps) {
  const { t } = useTranslation("pillbox");
  return (
    <View style={styles.block}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("Modifier l’apparence de la pilule : {{description}}", {
          description: formatPillDescriptionParts(t, design).join(", "),
        })}
        onPressIn={playPressHaptic}
        onPress={onEdit}
        style={({ pressed }) => [styles.preview, pressed && styles.pressed]}
      >
        <Pill design={design} displaySize={sizes.pillPreview} />
        <View style={styles.editBadge}>
          <Icon name="pencil" size={sizes.iconSmall} color={colors.onInk} />
        </View>
      </Pressable>
      <Text variant="small" tone="secondary" accessibilityElementsHidden style={styles.description}>
        {formatPillDescription(t, design)}
      </Text>
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Button label={t("Modifier l’apparence")} variant="secondary" onPress={onEdit} />
      </View>
    </View>
  );
}
