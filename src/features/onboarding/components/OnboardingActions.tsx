import { Button } from "@/design-system/components/Button/Button";
import { useTranslation } from "react-i18next";

type OnboardingActionsProps = {
  stepIndex: number;
  onNext: () => void;
  onAllowNotifications: () => void;
  onFinish: () => void;
};

export function OnboardingActions({
  stepIndex,
  onNext,
  onAllowNotifications,
  onFinish,
}: OnboardingActionsProps) {
  const { t } = useTranslation("onboarding");
  switch (stepIndex) {
    case 0:
      return <Button label={t("Continuer")} onPress={onNext} />;
    case 1:
      return (
        <>
          <Button label={t("Autoriser les notifications")} onPress={onAllowNotifications} />
          <Button label={t("Plus tard")} variant="text" onPress={onNext} />
        </>
      );
    case 2:
      return <Button label={t("J'ai compris")} onPress={onNext} />;
    default:
      return <Button label={t("Créer ma première prise")} onPress={onFinish} />;
  }
}
