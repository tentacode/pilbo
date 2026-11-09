import { useState } from "react";

import { colorFromHueAndIntensity, hueAndIntensityFromColor } from "@/design-system/utils/color";
import type { PillDesign } from "@/domain/med";

import type { ColorHalf } from "@/features/pillbox/components/ColorField";
import type { CustomColorSettings } from "@/features/pillbox/components/CustomColorPanel";
import { findSwatch } from "@/features/pillbox/utils/formatters";
import {
  type ColorCount,
  colorCountOf,
  withColor,
  withSingleColor,
} from "@/features/pillbox/utils/pillDesign";

export function useColorEditing(
  design: PillDesign,
  onDesignChange: (design: PillDesign) => void,
  initialColorCount: ColorCount,
) {
  const [colorCount, setColorCount] = useState(initialColorCount);
  const [activeHalf, setActiveHalf] = useState<ColorHalf>(0);
  const [isCustomColorPanelOpen, setIsCustomColorPanelOpen] = useState(
    () => findSwatch(design.colors[0]) === undefined,
  );
  const [customColor, setCustomColor] = useState(() => hueAndIntensityFromColor(design.colors[0]));

  function applyColor(color: string) {
    onDesignChange({ ...design, colors: withColor(design.colors, activeHalf, color, colorCount) });
  }

  return {
    colorCount,
    activeHalf,
    isCustomColorPanelOpen,
    customColor,
    selectColorCount: (count: ColorCount) => {
      setColorCount(count);
      setActiveHalf(0);
      setCustomColor(hueAndIntensityFromColor(design.colors[0]));
      if (count === 1) {
        onDesignChange(withSingleColor(design));
      }
    },
    syncColorCount: (newDesign: PillDesign) => {
      setColorCount(colorCountOf(newDesign));
      setActiveHalf(0);
    },
    selectHalf: (half: ColorHalf) => {
      setActiveHalf(half);
      setCustomColor(hueAndIntensityFromColor(design.colors[half]));
    },
    selectSwatchColor: (color: string) => {
      setIsCustomColorPanelOpen(false);
      applyColor(color);
    },
    closeCustomColorPanel: () => setIsCustomColorPanelOpen(false),
    openCustomColorPanel: () => {
      setIsCustomColorPanelOpen(true);
      setCustomColor(hueAndIntensityFromColor(design.colors[activeHalf]));
    },
    changeCustomColor: (settings: CustomColorSettings) => {
      setCustomColor(settings);
      applyColor(colorFromHueAndIntensity(settings.hue, settings.intensity));
    },
  };
}
