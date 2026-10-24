import type { ReactNode } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { ColorSwatch } from "@/design-system/components/ColorSwatch/ColorSwatch";
import { Text } from "@/design-system/components/Text/Text";
import { type PillSwatch, pillSwatches } from "@/design-system/tokens";
import type { PillDesign } from "@/domain/med";

import { findSwatch, formatColorTitle } from "@/features/pillbox/utils/formatters";
import { ColorHalfOption } from "./ColorHalfOption";
import { CustomColorButton } from "./CustomColorButton";
import { styles } from "./ColorField.styles";
import type { TFunction } from "i18next";

export type ColorHalf = 0 | 1;

const HALVES: ColorHalf[] = [0, 1];
const SWATCHES = Object.keys(pillSwatches) as PillSwatch[];

function halfLabel(t: TFunction<"pillbox">, half: ColorHalf): string {
  return t("Couleur {{number}}", { number: half + 1 });
}

type ColorFieldProps = {
  design: PillDesign;
  activeHalf: ColorHalf;
  isCustomColorPanelOpen: boolean;
  onActiveHalfChange: (half: ColorHalf) => void;
  onColorChange: (color: string) => void;
  onCustomColorPress: () => void;
  children?: ReactNode;
};

export function ColorField({
  design,
  activeHalf,
  isCustomColorPanelOpen,
  onActiveHalfChange,
  onColorChange,
  onCustomColorPress,
  children,
}: ColorFieldProps) {
  const { t } = useTranslation("pillbox");
  const activeColor = design.colors[activeHalf];
  const activeSwatch = isCustomColorPanelOpen ? undefined : findSwatch(activeColor);
  return (
    <View>
      <View style={styles.labelRow}>
        <Text variant="smallBold" tone="secondary" accessibilityRole="header">
          {t("Couleurs")}
        </Text>
        <Text variant="small" accessibilityElementsHidden>
          {formatColorTitle(t, activeColor)}
        </Text>
      </View>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={t("Partie à colorer")}
        style={styles.halves}
      >
        {HALVES.map((half) => (
          <ColorHalfOption
            key={half}
            label={halfLabel(t, half)}
            color={design.colors[half]}
            isSelected={half === activeHalf}
            onPress={() => onActiveHalfChange(half)}
          />
        ))}
      </View>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={halfLabel(t, activeHalf)}
        style={styles.swatches}
      >
        {SWATCHES.map((swatch) => (
          <ColorSwatch
            key={swatch}
            label={formatColorTitle(t, pillSwatches[swatch])}
            color={pillSwatches[swatch]}
            isSelected={swatch === activeSwatch}
            onPress={() => onColorChange(pillSwatches[swatch])}
          />
        ))}
      </View>
      <View style={styles.customColorButton}>
        <CustomColorButton
          color={activeColor}
          isSelected={activeSwatch === undefined}
          isExpanded={isCustomColorPanelOpen}
          onPress={onCustomColorPress}
        />
      </View>
      {children}
    </View>
  );
}
