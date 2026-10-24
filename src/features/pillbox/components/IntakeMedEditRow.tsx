import { Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";

import { Icon } from "@/design-system/components/Icon/Icon";
import { Pill } from "@/design-system/components/Pill/Pill";
import { Stepper } from "@/design-system/components/Stepper/Stepper";
import { colors, sizes } from "@/design-system/tokens";
import { formatMedLabel, type MedQuantity } from "@/domain/med";

import { useMedRowActionSheet } from "@/features/pillbox/hooks/useMedRowActionSheet";
import { useMedRowLayout } from "@/features/pillbox/hooks/useMedRowLayout";
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
  const { t } = useTranslation("pillbox");
  const showActionSheet = useMedRowActionSheet();
  const { onRowLayout, onStepperLayout, isStacked } = useMedRowLayout();
  const label = formatMedLabel(med);
  return (
    <View
      onLayout={onRowLayout}
      style={[styles.row, isStacked && styles.stackedRow, hasTopBorder && styles.topBorder]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={[label, med.detail].filter(Boolean).join(", ")}
        accessibilityHint={t("Affiche les actions du médicament.")}
        onPress={() => showActionSheet({ medLabel: label, onEditMed, onRemove })}
        style={({ pressed }) => [
          styles.medButton,
          isStacked && styles.stackedMedButton,
          pressed && styles.pressed,
        ]}
      >
        <Pill design={med.design} displaySize={sizes.pillInRow} />
        <View style={styles.texts}>
          <MedName med={med} />
        </View>
        <Icon name="chevronRight" size={sizes.iconSmall} color={colors.inkSecondary} />
      </Pressable>
      <View onLayout={onStepperLayout} style={isStacked && styles.stackedStepper}>
        <Stepper
          value={quantity}
          min={MINIMUM_MED_QUANTITY}
          max={MAXIMUM_MED_QUANTITY}
          onChange={onQuantityChange}
          onRemove={onRemove}
          formatValue={(value) => `${value} ×`}
          labels={{
            value: t("Quantité de {{med}}", { med: label }),
            decrement: t("Retirer un comprimé de {{med}}", { med: label }),
            increment: t("Ajouter un comprimé de {{med}}", { med: label }),
            remove: t("Retirer {{med}} de la prise", { med: label }),
          }}
        />
      </View>
    </View>
  );
}
