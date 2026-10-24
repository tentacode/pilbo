import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { ColorSlider } from "@/design-system/components/ColorSlider/ColorSlider";
import { Text } from "@/design-system/components/Text/Text";
import {
  colorFromHueAndIntensity,
  HUE_MAXIMUM,
  hueTrackColors,
  INTENSITY_MAXIMUM,
  intensityTrackColors,
} from "@/design-system/utils/color";

import { styles } from "./CustomColorPanel.styles";
import type { TFunction } from "i18next";

export type CustomColorSettings = {
  hue: number;
  intensity: number;
};

type CustomColorPanelProps = CustomColorSettings & {
  onChange: (settings: CustomColorSettings) => void;
  onLayout?: () => void;
};

function formatPercentage(t: TFunction<"pillbox">, value: number, maximum: number): string {
  return t("{{percentage}} %", { percentage: Math.round((value / maximum) * 100) });
}

export function CustomColorPanel({ hue, intensity, onChange, onLayout }: CustomColorPanelProps) {
  const { t } = useTranslation("pillbox");
  const color = colorFromHueAndIntensity(hue, intensity);
  return (
    <View onLayout={onLayout} style={styles.panel}>
      <Text variant="small" tone="secondary" accessibilityElementsHidden style={styles.label}>
        {t("Teinte")}
      </Text>
      <ColorSlider
        value={hue}
        maximum={HUE_MAXIMUM}
        trackColors={hueTrackColors(intensity)}
        thumbColor={color}
        accessibilityLabel={t("Teinte")}
        formatAccessibilityValue={(value) => formatPercentage(t, value, HUE_MAXIMUM)}
        onChange={(value) => onChange({ hue: value, intensity })}
      />
      <Text
        variant="small"
        tone="secondary"
        accessibilityElementsHidden
        style={[styles.label, styles.secondLabel]}
      >
        {t("Intensité")}
      </Text>
      <ColorSlider
        value={intensity}
        maximum={INTENSITY_MAXIMUM}
        trackColors={intensityTrackColors(hue)}
        thumbColor={color}
        accessibilityLabel={t("Intensité, du clair au foncé")}
        formatAccessibilityValue={(value) => formatPercentage(t, value, INTENSITY_MAXIMUM)}
        onChange={(value) => onChange({ hue, intensity: value })}
      />
    </View>
  );
}
