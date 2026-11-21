import { router } from "expo-router";
import { useState } from "react";

import { useNotificationPermission } from "@/features/notifications/hooks/useNotificationPermission";

import { useOnboardingStore } from "../store/onboardingStore";

type OnboardingProgress = {
  stepIndex: number;
  areNotificationsAllowed: boolean;
  isRestartedFromSettings: boolean;
  goToNextStep: () => void;
  goToStep: (stepIndex: number) => void;
  allowNotifications: () => void;
  finish: () => void;
};

export function useOnboardingProgress(): OnboardingProgress {
  const [stepIndex, setStepIndex] = useState(0);
  const [isWaitingForPermission, setIsWaitingForPermission] = useState(false);
  const { isGranted, request } = useNotificationPermission();
  const setOnboardingDone = useOnboardingStore((state) => state.setOnboardingDone);
  const isRestartedFromSettings = useOnboardingStore((state) => state.isRestartedFromSettings);

  const goToStep = (nextStepIndex: number) => {
    setIsWaitingForPermission(false);
    setStepIndex(nextStepIndex);
  };

  const goToNextStep = () => goToStep(stepIndex + 1);

  if (isWaitingForPermission && isGranted) {
    goToNextStep();
  }

  const allowNotifications = () => {
    setIsWaitingForPermission(true);
    request();
  };

  const finish = () => {
    setOnboardingDone(true);
    router.replace(isRestartedFromSettings ? "/settings" : "/pillbox");
  };

  return {
    stepIndex,
    areNotificationsAllowed: isGranted === true,
    isRestartedFromSettings,
    goToNextStep,
    goToStep,
    allowNotifications,
    finish,
  };
}
