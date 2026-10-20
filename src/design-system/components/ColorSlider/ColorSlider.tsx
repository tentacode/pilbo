import { useId, useState } from "react";
import { type AccessibilityActionEvent, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import { sizes } from "../../tokens";
import { styles } from "./ColorSlider.styles";

const THUMB_RADIUS = sizes.sliderThumb / 2;
const ACCESSIBILITY_STEP_RATIO = 0.05;
const ADJUSTABLE_ACTIONS = [{ name: "increment" }, { name: "decrement" }];
const HORIZONTAL_ACTIVATION_DISTANCE = 4;
const VERTICAL_FAILURE_DISTANCE = 12;

type ColorSliderProps = {
  value: number;
  maximum: number;
  trackColors: string[];
  thumbColor: string;
  accessibilityLabel: string;
  formatAccessibilityValue: (value: number) => string;
  onChange: (value: number) => void;
};

function clamp(value: number, maximum: number): number {
  return Math.min(Math.max(value, 0), maximum);
}

export function ColorSlider({
  value,
  maximum,
  trackColors,
  thumbColor,
  accessibilityLabel,
  formatAccessibilityValue,
  onChange,
}: ColorSliderProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const gradientIdentifier = useId();
  const usableWidth = Math.max(trackWidth - sizes.sliderThumb, 1);
  const accessibilityStep = maximum * ACCESSIBILITY_STEP_RATIO;

  function changeFromPosition(positionX: number) {
    onChange(Math.round(clamp(((positionX - THUMB_RADIUS) / usableWidth) * maximum, maximum)));
  }

  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .activeOffsetX([-HORIZONTAL_ACTIVATION_DISTANCE, HORIZONTAL_ACTIVATION_DISTANCE])
    .failOffsetY([-VERTICAL_FAILURE_DISTANCE, VERTICAL_FAILURE_DISTANCE])
    .onUpdate((event) => changeFromPosition(event.x));
  const tapGesture = Gesture.Tap()
    .runOnJS(true)
    .onEnd((event) => changeFromPosition(event.x));

  function handleAccessibilityAction(event: AccessibilityActionEvent) {
    const direction = event.nativeEvent.actionName === "increment" ? 1 : -1;
    onChange(Math.round(clamp(value + direction * accessibilityStep, maximum)));
  }

  return (
    <GestureDetector gesture={Gesture.Race(panGesture, tapGesture)}>
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{
          min: 0,
          max: maximum,
          now: value,
          text: formatAccessibilityValue(value),
        }}
        accessibilityActions={ADJUSTABLE_ACTIONS}
        onAccessibilityAction={handleAccessibilityAction}
        onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
        style={styles.track}
      >
        <View style={styles.gradient}>
          <Svg width="100%" height="100%" accessible={false}>
            <Defs>
              <LinearGradient id={gradientIdentifier} x1="0" y1="0" x2="1" y2="0">
                {trackColors.map((color, index) => (
                  <Stop
                    key={`${color}-${index}`}
                    offset={index / Math.max(trackColors.length - 1, 1)}
                    stopColor={color}
                  />
                ))}
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill={`url(#${gradientIdentifier})`} />
          </Svg>
        </View>
        <View
          pointerEvents="none"
          style={[
            styles.thumb,
            { left: (value / maximum) * usableWidth, backgroundColor: thumbColor },
          ]}
        />
      </View>
    </GestureDetector>
  );
}
