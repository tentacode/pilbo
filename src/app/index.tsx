import { Redirect } from "expo-router";

import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";

export default function Index() {
  const onboardingDone = useOnboardingStore((state) => state.onboardingDone);
  return <Redirect href={onboardingDone ? "/today" : "/onboarding"} />;
}
