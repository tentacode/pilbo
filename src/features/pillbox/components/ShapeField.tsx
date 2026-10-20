import { View } from "react-native";

import type { PillDesign, PillShape } from "@/domain/med";

import { pillShapes, withShape } from "@/features/pillbox/utils/pillDesign";
import { FormSection } from "./FormSection";
import { ShapeOption } from "./ShapeOption";
import { styles } from "./ShapeField.styles";

type ShapeFieldProps = {
  design: PillDesign;
  onChange: (shape: PillShape) => void;
};

export function ShapeField({ design, onChange }: ShapeFieldProps) {
  return (
    <FormSection label="Forme">
      <View accessibilityRole="radiogroup" accessibilityLabel="Forme" style={styles.shapes}>
        {pillShapes().map((shape) => (
          <ShapeOption
            key={shape}
            design={withShape(design, shape)}
            isSelected={shape === design.shape}
            onPress={() => onChange(shape)}
          />
        ))}
      </View>
    </FormSection>
  );
}
