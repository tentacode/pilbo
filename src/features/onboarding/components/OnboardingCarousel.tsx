import { useEffect, useRef } from "react";
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useReduceMotion } from "@/design-system/hooks/useReduceMotion";
import { spacing } from "@/design-system/tokens";

import { OnboardingStep } from "./OnboardingStep";
import type { OnboardingStepContent } from "./onboardingSteps";
import { styles } from "./OnboardingCarousel.styles";

type OnboardingCarouselProps = {
  steps: OnboardingStepContent[];
  stepIndex: number;
  onSwipeToStep: (stepIndex: number) => void;
};

export function OnboardingCarousel({ steps, stepIndex, onSwipeToStep }: OnboardingCarouselProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReduceMotion();
  const scrollReference = useRef<ScrollView>(null);

  useEffect(() => {
    scrollReference.current?.scrollTo({ x: stepIndex * width, animated: !reduceMotion });
  }, [reduceMotion, stepIndex, width]);

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const swipedStepIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (swipedStepIndex !== stepIndex) onSwipeToStep(swipedStepIndex);
  };

  return (
    <ScrollView
      ref={scrollReference}
      testID="onboarding-carousel"
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onMomentumScrollEnd={onMomentumScrollEnd}
      style={styles.carousel}
    >
      {steps.map((step, index) => {
        const isCurrent = index === stepIndex;
        return (
          <View
            key={step.title}
            style={{ width }}
            accessibilityElementsHidden={!isCurrent}
            importantForAccessibility={isCurrent ? "auto" : "no-hide-descendants"}
          >
            <ScrollView contentContainerStyle={{ paddingTop: insets.top + spacing.small }}>
              <OnboardingStep step={step} isCurrent={isCurrent} />
            </ScrollView>
          </View>
        );
      })}
    </ScrollView>
  );
}
