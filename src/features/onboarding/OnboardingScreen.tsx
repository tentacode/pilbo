import { ScrollView, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { spacing } from "@/design-system/tokens";

import { OnboardingActions } from "./components/OnboardingActions";
import { OnboardingFooter } from "./components/OnboardingFooter";
import { OnboardingStep } from "./components/OnboardingStep";
import { onboardingStepsOf } from "./components/onboardingSteps";
import { useOnboardingProgress } from "./hooks/useOnboardingProgress";
import { useStepSlide } from "./hooks/useStepSlide";
import { styles } from "./OnboardingScreen.styles";

export function OnboardingScreen() {
  const { t } = useTranslation("onboarding");
  const steps = onboardingStepsOf(t);
  const insets = useSafeAreaInsets();
  const { stepIndex, goToNextStep, allowNotifications, finish } = useOnboardingProgress();
  const { displayedStepIndex, slideStyle } = useStepSlide(stepIndex);

  return (
    <View style={[styles.screen, { paddingBottom: Math.max(insets.bottom, spacing.large) }]}>
      <Animated.View style={[styles.step, slideStyle]}>
        <ScrollView
          key={displayedStepIndex}
          contentContainerStyle={{ paddingTop: insets.top + spacing.small }}
        >
          <OnboardingStep step={steps[displayedStepIndex]} />
        </ScrollView>
      </Animated.View>
      <OnboardingFooter progress={{ currentIndex: stepIndex, count: steps.length }}>
        <OnboardingActions
          stepIndex={stepIndex}
          onNext={goToNextStep}
          onAllowNotifications={allowNotifications}
          onFinish={finish}
        />
      </OnboardingFooter>
    </View>
  );
}
