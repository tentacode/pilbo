import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { Button } from "@/design-system/components/Button/Button";
import { spacing } from "@/design-system/tokens";

import { OnboardingFooter } from "./components/OnboardingFooter";
import { OnboardingStep } from "./components/OnboardingStep";
import { notMedicalStepOf } from "./components/onboardingSteps";
import { styles } from "./NotMedicalScreen.styles";

export function NotMedicalScreen() {
  const { t } = useTranslation("onboarding");
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingBottom: Math.max(insets.bottom, spacing.large) }]}>
      <ScrollView
        style={styles.step}
        contentContainerStyle={{ paddingTop: insets.top + spacing.small }}
      >
        <OnboardingStep step={notMedicalStepOf(t)} />
      </ScrollView>
      <OnboardingFooter>
        <Button label={t("Retour")} onPress={() => router.back()} />
      </OnboardingFooter>
    </View>
  );
}
