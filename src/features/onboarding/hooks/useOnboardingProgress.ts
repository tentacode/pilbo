import { router } from "expo-router";
import { useState } from "react";

import { useNotificationPermission } from "@/features/notifications/hooks/useNotificationPermission";

import { useOnboardingStore } from "../store/onboardingStore";

type OnboardingProgress = {
  stepIndex: number;
  goToNextStep: () => void;
  allowNotifications: () => void;
  finish: () => void;
};

export function useOnboardingProgress(): OnboardingProgress {
  const [stepIndex, setStepIndex] = useState(0);
  const [isWaitingForPermission, setIsWaitingForPermission] = useState(false);
  const { isGranted, request } = useNotificationPermission();
  const setOnboardingDone = useOnboardingStore((state) => state.setOnboardingDone);

  const goToNextStep = () => {
    setIsWaitingForPermission(false);
    setStepIndex(stepIndex + 1);
  };

  if (isWaitingForPermission && isGranted) {
    goToNextStep();
  }

  const allowNotifications = () => {
    setIsWaitingForPermission(true);
    request();
  };

  const finish = () => {
    setOnboardingDone(true);
    router.replace("/pillbox");
  };

  return { stepIndex, goToNextStep, allowNotifications, finish };
}
