import { View } from "react-native";

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

export type CustomColorSettings = {
  hue: number;
  intensity: number;
};

type CustomColorPanelProps = CustomColorSettings & {
  onChange: (settings: CustomColorSettings) => void;
  onLayout?: () => void;
};

function formatPercentage(value: number, maximum: number): string {
  return `${Math.round((value / maximum) * 100)} %`;
}

export function CustomColorPanel({ hue, intensity, onChange, onLayout }: CustomColorPanelProps) {
  const color = colorFromHueAndIntensity(hue, intensity);
  return (
    <View onLayout={onLayout} style={styles.panel}>
      <Text variant="small" tone="secondary" accessibilityElementsHidden style={styles.label}>
        Teinte
      </Text>
      <ColorSlider
        value={hue}
        maximum={HUE_MAXIMUM}
        trackColors={hueTrackColors(intensity)}
        thumbColor={color}
        accessibilityLabel="Teinte"
        formatAccessibilityValue={(value) => formatPercentage(value, HUE_MAXIMUM)}
        onChange={(value) => onChange({ hue: value, intensity })}
      />
      <Text
        variant="small"
        tone="secondary"
        accessibilityElementsHidden
        style={[styles.label, styles.secondLabel]}
      >
        Intensité
      </Text>
      <ColorSlider
        value={intensity}
        maximum={INTENSITY_MAXIMUM}
        trackColors={intensityTrackColors(hue)}
        thumbColor={color}
        accessibilityLabel="Intensité, du clair au foncé"
        formatAccessibilityValue={(value) => formatPercentage(value, INTENSITY_MAXIMUM)}
        onChange={(value) => onChange({ hue, intensity: value })}
      />
    </View>
  );
}
