import { View } from "react-native";
import { useTranslation } from "react-i18next";

import { useBottomSafeSpacing } from "@/design-system/hooks/useBottomSafeSpacing";

import { OnboardingActions } from "./components/OnboardingActions";
import { OnboardingCarousel } from "./components/OnboardingCarousel";
import { OnboardingFooter } from "./components/OnboardingFooter";
import { onboardingStepsOf } from "./components/onboardingSteps";
import { useOnboardingProgress } from "./hooks/useOnboardingProgress";
import { useStyles } from "./OnboardingScreen.styles";

export function OnboardingScreen() {
  const styles = useStyles();
  const { t } = useTranslation("onboarding");
  const steps = onboardingStepsOf(t);
  const bottomSafeSpacing = useBottomSafeSpacing();
  const {
    stepIndex,
    areNotificationsAllowed,
    isRestartedFromSettings,
    goToNextStep,
    goToStep,
    allowNotifications,
    finish,
  } = useOnboardingProgress();

  return (
    <View style={[styles.screen, { paddingBottom: bottomSafeSpacing }]}>
      <OnboardingCarousel steps={steps} stepIndex={stepIndex} onSwipeToStep={goToStep} />
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
