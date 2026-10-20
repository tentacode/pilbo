import { Pressable, View } from "react-native";

import { Icon } from "@/design-system/components/Icon/Icon";
import { Pill } from "@/design-system/components/Pill/Pill";
import { Stepper } from "@/design-system/components/Stepper/Stepper";
import { colors, sizes } from "@/design-system/tokens";
import { formatMedLabel, type MedQuantity } from "@/domain/med";

import { useMedRowActionSheet } from "@/features/pillbox/hooks/useMedRowActionSheet";
import { MAXIMUM_MED_QUANTITY, MINIMUM_MED_QUANTITY } from "@/features/pillbox/utils/validators";
import { MedName } from "./MedName";
import { styles } from "./IntakeMedEditRow.styles";

type IntakeMedEditRowProps = MedQuantity & {
  hasTopBorder: boolean;
  onEditMed: () => void;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
};

export function IntakeMedEditRow({
  med,
  quantity,
  hasTopBorder,
  onEditMed,
  onQuantityChange,
  onRemove,
}: IntakeMedEditRowProps) {
  const showActionSheet = useMedRowActionSheet();
  const label = formatMedLabel(med);
  return (
    <View style={[styles.row, hasTopBorder && styles.topBorder]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={[label, med.detail].filter(Boolean).join(", ")}
        accessibilityHint="Affiche les actions du médicament."
        onPress={() => showActionSheet({ medLabel: label, onEditMed, onRemove })}
        style={({ pressed }) => [styles.medButton, pressed && styles.pressed]}
      >
        <Pill design={med.design} displaySize={sizes.pillInRow} />
        <View style={styles.texts}>
          <MedName med={med} />
        </View>
        <Icon name="chevronRight" size={sizes.iconSmall} color={colors.inkSecondary} />
      </Pressable>
      <Stepper
        value={quantity}
        min={MINIMUM_MED_QUANTITY}
        max={MAXIMUM_MED_QUANTITY}
        onChange={onQuantityChange}
        onRemove={onRemove}
        formatValue={(value) => `${value} ×`}
        labels={{
          value: `Quantité de ${label}`,
          decrement: `Retirer un comprimé de ${label}`,
          increment: `Ajouter un comprimé de ${label}`,
          remove: `Retirer ${label} de la prise`,
        }}
      />
    </View>
  );
}
