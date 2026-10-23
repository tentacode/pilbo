import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/design-system/components/Button/Button";
import { spacing } from "@/design-system/tokens";

import { OnboardingFooter } from "./components/OnboardingFooter";
import { OnboardingStep } from "./components/OnboardingStep";
import { notMedicalStep } from "./components/onboardingSteps";
import { styles } from "./NotMedicalScreen.styles";

export function NotMedicalScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingBottom: Math.max(insets.bottom, spacing.large) }]}>
      <ScrollView
        style={styles.step}
        contentContainerStyle={{ paddingTop: insets.top + spacing.small }}
      >
        <OnboardingStep step={notMedicalStep} />
      </ScrollView>
      <OnboardingFooter>
        <Button label="Retour" onPress={() => router.back()} />
      </OnboardingFooter>
    </View>
  );
}
