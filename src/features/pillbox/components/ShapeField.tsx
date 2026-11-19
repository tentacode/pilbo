import { View } from "react-native";
import { useTranslation } from "react-i18next";

import type { PillDesign, PillShape } from "@/domain/med";

import { pillShapes, withShape } from "@/features/pillbox/utils/pillDesign";
import { FormSection } from "./FormSection";
import { ShapeOption } from "./ShapeOption";
import { SHAPE_COLUMN_COUNT, styles } from "./ShapeField.styles";

type ShapeFieldProps = {
  design: PillDesign;
  onChange: (shape: PillShape) => void;
};

export function ShapeField({ design, onChange }: ShapeFieldProps) {
  const { t } = useTranslation("pillbox");
  const shapes = pillShapes();
  const emptyCellCount =
    (SHAPE_COLUMN_COUNT - (shapes.length % SHAPE_COLUMN_COUNT)) % SHAPE_COLUMN_COUNT;
  return (
    <FormSection label={t("Forme")}>
      <View accessibilityRole="radiogroup" accessibilityLabel={t("Forme")} style={styles.shapes}>
        {shapes.map((shape) => (
          <ShapeOption
            key={shape}
            design={withShape(design, shape)}
            isSelected={shape === design.shape}
            onPress={() => onChange(shape)}
          />
        ))}
        {Array.from({ length: emptyCellCount }, (_, index) => (
          <View key={index} style={styles.emptyCell} />
        ))}
      </View>
    </FormSection>
  );
}
