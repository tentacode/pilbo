import { Button } from "@/design-system/components/Button/Button";

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
  switch (stepIndex) {
    case 0:
      return <Button label="Continuer" onPress={onNext} />;
    case 1:
      return (
        <>
          <Button label="Autoriser les notifications" onPress={onAllowNotifications} />
          <Button label="Plus tard" variant="text" onPress={onNext} />
        </>
      );
    case 2:
      return <Button label="J'ai compris" onPress={onNext} />;
    default:
      return <Button label="Créer ma première prise" onPress={onFinish} />;
  }
}
