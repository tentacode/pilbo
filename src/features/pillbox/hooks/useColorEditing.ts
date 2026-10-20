import { useState } from "react";

import { colorFromHueAndIntensity, hueAndIntensityFromColor } from "@/design-system/utils/color";
import type { PillDesign } from "@/domain/med";

import type { ColorHalf } from "@/features/pillbox/components/ColorField";
import type { CustomColorSettings } from "@/features/pillbox/components/CustomColorPanel";
import { findSwatch } from "@/features/pillbox/utils/formatters";
import { withColor } from "@/features/pillbox/utils/pillDesign";

export function useColorEditing(design: PillDesign, onDesignChange: (design: PillDesign) => void) {
  const [activeHalf, setActiveHalf] = useState<ColorHalf>(0);
  const [isCustomColorPanelOpen, setIsCustomColorPanelOpen] = useState(
    () => findSwatch(design.colors[0]) === undefined,
  );
  const [customColor, setCustomColor] = useState(() => hueAndIntensityFromColor(design.colors[0]));

  return {
    activeHalf,
    isCustomColorPanelOpen,
    customColor,
    selectHalf: (half: ColorHalf) => {
      setActiveHalf(half);
      setCustomColor(hueAndIntensityFromColor(design.colors[half]));
    },
    selectSwatchColor: (color: string) => {
      setIsCustomColorPanelOpen(false);
      onDesignChange({ ...design, colors: withColor(design.colors, activeHalf, color) });
    },
    openCustomColorPanel: () => {
      setIsCustomColorPanelOpen(true);
      setCustomColor(hueAndIntensityFromColor(design.colors[activeHalf]));
    },
    changeCustomColor: (settings: CustomColorSettings) => {
      setCustomColor(settings);
      const color = colorFromHueAndIntensity(settings.hue, settings.intensity);
      onDesignChange({ ...design, colors: withColor(design.colors, activeHalf, color) });
    },
  };
}
