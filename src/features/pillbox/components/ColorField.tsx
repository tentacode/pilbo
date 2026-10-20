import type { ReactNode } from "react";
import { View } from "react-native";

import { ColorSwatch } from "@/design-system/components/ColorSwatch/ColorSwatch";
import { Text } from "@/design-system/components/Text/Text";
import { customColorWheel, type PillSwatch, pillSwatches } from "@/design-system/tokens";
import type { PillDesign } from "@/domain/med";

import { findSwatch, formatColorTitle } from "@/features/pillbox/utils/formatters";
import { ColorHalfOption } from "./ColorHalfOption";
import { styles } from "./ColorField.styles";

export type ColorHalf = 0 | 1;

const HALVES: ColorHalf[] = [0, 1];
const SWATCHES = Object.keys(pillSwatches) as PillSwatch[];
const CUSTOM_COLOR_LABEL = "Autre couleur";

function halfLabel(half: ColorHalf): string {
  return `Couleur ${half + 1}`;
}

type ColorFieldProps = {
  design: PillDesign;
  activeHalf: ColorHalf;
  isCustomColorSelected: boolean;
  onActiveHalfChange: (half: ColorHalf) => void;
  onColorChange: (color: string) => void;
  onCustomColorPress: () => void;
  children?: ReactNode;
};

export function ColorField({
  design,
  activeHalf,
  isCustomColorSelected,
  onActiveHalfChange,
  onColorChange,
  onCustomColorPress,
  children,
}: ColorFieldProps) {
  const activeColor = design.colors[activeHalf];
  const activeSwatch = isCustomColorSelected ? undefined : findSwatch(activeColor);
  return (
    <View>
      <View style={styles.labelRow}>
        <Text variant="smallBold" tone="secondary" accessibilityRole="header">
          Couleurs
        </Text>
        <Text variant="small" accessibilityElementsHidden>
          {formatColorTitle(activeColor)}
        </Text>
      </View>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel="Partie à colorer"
        style={styles.halves}
      >
        {HALVES.map((half) => (
          <ColorHalfOption
            key={half}
            label={halfLabel(half)}
            color={design.colors[half]}
            isSelected={half === activeHalf}
            onPress={() => onActiveHalfChange(half)}
          />
        ))}
      </View>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={halfLabel(activeHalf)}
        style={styles.swatches}
      >
        {SWATCHES.map((swatch) => (
          <ColorSwatch
            key={swatch}
            label={formatColorTitle(pillSwatches[swatch])}
            colors={[pillSwatches[swatch]]}
            isSelected={swatch === activeSwatch}
            onPress={() => onColorChange(pillSwatches[swatch])}
          />
        ))}
        <ColorSwatch
          label={CUSTOM_COLOR_LABEL}
          colors={customColorWheel}
          isSelected={activeSwatch === undefined}
          onPress={onCustomColorPress}
        />
      </View>
      {children}
    </View>
  );
}
