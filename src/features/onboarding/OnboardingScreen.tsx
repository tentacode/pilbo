import { ScrollView, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { useBottomSafeSpacing } from "@/design-system/hooks/useBottomSafeSpacing";
import { spacing } from "@/design-system/tokens";

import { OnboardingActions } from "./components/OnboardingActions";
import { OnboardingFooter } from "./components/OnboardingFooter";
import { OnboardingStep } from "./components/OnboardingStep";
import { onboardingStepsOf } from "./components/onboardingSteps";
import { useOnboardingProgress } from "./hooks/useOnboardingProgress";
import { useStepSlide } from "./hooks/useStepSlide";
import { useStyles } from "./OnboardingScreen.styles";

export function OnboardingScreen() {
  const styles = useStyles();
  const { t } = useTranslation("onboarding");
  const steps = onboardingStepsOf(t);
  const insets = useSafeAreaInsets();
  const bottomSafeSpacing = useBottomSafeSpacing();
  const {
    stepIndex,
    areNotificationsAllowed,
    isRestartedFromSettings,
    goToNextStep,
    allowNotifications,
    finish,
  } = useOnboardingProgress();
  const { displayedStepIndex, slideStyle } = useStepSlide(stepIndex);

  return (
    <View style={[styles.screen, { paddingBottom: bottomSafeSpacing }]}>
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
          areNotificationsAllowed={areNotificationsAllowed}
          isRestartedFromSettings={isRestartedFromSettings}
          onNext={goToNextStep}
          onAllowNotifications={allowNotifications}
          onFinish={finish}
        />
      </OnboardingFooter>
    </View>
  );
}
