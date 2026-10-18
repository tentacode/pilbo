import { useWindowDimensions, View } from "react-native";

import { Text } from "@/design-system/components/Text/Text";
import { useAccessibilityFocusOnMount } from "@/design-system/hooks/useAccessibilityFocusOnMount";
import { onboardingIllustrationScreenRatio, sizes } from "@/design-system/tokens";

import type { OnboardingStepContent } from "./onboardingSteps";
import { styles } from "./OnboardingStep.styles";

type OnboardingStepProps = {
  step: OnboardingStepContent;
};

export function OnboardingStep({ step }: OnboardingStepProps) {
  const { title, body, Illustration, illustrationLabel, illustrationBackground } = step;
  const titleReference = useAccessibilityFocusOnMount<View>();
  const { height: windowHeight } = useWindowDimensions();
  const illustrationHeight = Math.min(
    sizes.onboardingIllustrationHeight,
    windowHeight * onboardingIllustrationScreenRatio,
  );
  const artSize =
    (illustrationHeight * sizes.onboardingIllustrationArt) / sizes.onboardingIllustrationHeight;

  return (
    <View>
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={illustrationLabel}
        style={[
          styles.illustration,
          { height: illustrationHeight, backgroundColor: illustrationBackground },
        ]}
      >
        <Illustration size={artSize} />
      </View>
      <View style={styles.text}>
        <View ref={titleReference} accessible accessibilityRole="header">
          <Text variant="largeHeading">{title}</Text>
        </View>
        <Text variant="lead" tone="secondary">
          {body}
        </Text>
      </View>
    </View>
  );
}
