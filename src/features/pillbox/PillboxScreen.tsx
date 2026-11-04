import { router } from "expo-router";
import { useTranslation } from "react-i18next";

import { IconButton } from "@/design-system/components/IconButton/IconButton";
import { Screen } from "@/design-system/components/Screen/Screen";
import { ScreenHeader } from "@/design-system/components/ScreenHeader/ScreenHeader";

import { IntakeList } from "./components/IntakeList";
import { PillboxEmptyState } from "./components/PillboxEmptyState";
import { usePillboxData } from "@/features/pillbox/hooks/usePillboxData";

function openNewIntake() {
  router.push("/intake");
}

function openIntake(intakeId: string) {
  router.push({ pathname: "/intake", params: { intakeId } });
}

export function PillboxScreen() {
  const { t } = useTranslation("pillbox");
  const { intakes } = usePillboxData();

  return (
    <Screen>
      <ScreenHeader
        title={t("Pilulier")}
        action={
          <IconButton
            icon="plus"
            accessibilityLabel={t("Nouvelle prise")}
            onPress={openNewIntake}
          />
        }
      />
      {intakes.length === 0 ? (
        <PillboxEmptyState onCreateIntake={openNewIntake} />
      ) : (
        <IntakeList intakes={intakes} onIntakePress={openIntake} />
      )}
    </Screen>
  );
}
