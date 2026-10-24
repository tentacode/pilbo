import type { ColorValue } from "react-native";
import type { TFunction } from "i18next";
import type { ComponentType } from "react";

import { colors } from "@/design-system/tokens";

import { OnboardingIntakesIllustration } from "./OnboardingIntakesIllustration";
import { OnboardingNotMedicalIllustration } from "./OnboardingNotMedicalIllustration";
import { OnboardingPrivacyIllustration } from "./OnboardingPrivacyIllustration";
import { OnboardingRemindersIllustration } from "./OnboardingRemindersIllustration";

export type IllustrationProps = {
  size: number;
};

export type OnboardingStepContent = {
  title: string;
  body: string;
  Illustration: ComponentType<IllustrationProps>;
  illustrationLabel: string;
  illustrationBackground: ColorValue;
};

export function notMedicalStepOf(t: TFunction<"onboarding">): OnboardingStepContent {
  return {
    title: t("Pilbo n'est pas une application médicale"),
    body: t(
      "Elle ne donne aucun conseil et ne remplace pas l'avis de votre médecin ou de votre pharmacien. Elle vous aide à suivre ce que vous y avez noté.",
    ),
    Illustration: OnboardingNotMedicalIllustration,
    illustrationLabel: t("Un carnet ouvert : des notes d'un côté, des pilules de l'autre"),
    illustrationBackground: colors.roseSoft,
  };
}

export function onboardingStepsOf(t: TFunction<"onboarding">): OnboardingStepContent[] {
  return [
    {
      title: t("Vos médicaments, regroupés en prises"),
      body: t(
        "Une prise, c'est un horaire, des jours et les médicaments à prendre ensemble. Vous la validez d'un seul geste.",
      ),
      Illustration: OnboardingIntakesIllustration,
      illustrationLabel: t(
        "Trois prises de la journée : 08:30 prise, 12:30 en retard, 20:30 à venir",
      ),
      illustrationBackground: colors.accentSoft,
    },
    {
      title: t("Un rappel, puis un autre"),
      body: t(
        "À l'heure d'une prise, Pilbo vous le rappelle toutes les 10 minutes, jusqu'à ce que vous l'ayez prise ou ignorée.",
      ),
      Illustration: OnboardingRemindersIllustration,
      illustrationLabel: t(
        "Une cloche et trois rappels à 20:30, 20:40 et 20:50, le dernier validé",
      ),
      illustrationBackground: colors.butterSoft,
    },
    notMedicalStepOf(t),
    {
      title: t("Vos données restent sur ce téléphone"),
      body: t(
        "Pas de compte, rien n'est envoyé ailleurs. Si vous supprimez l'app, tout disparaît avec elle.",
      ),
      Illustration: OnboardingPrivacyIllustration,
      illustrationLabel: t("Un téléphone qui contient les pilules, fermé par un cadenas"),
      illustrationBackground: colors.turquoiseSoft,
    },
  ];
}
