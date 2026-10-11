import { IconButton } from "@/design-system/components/IconButton/IconButton";
import { Screen } from "@/design-system/components/Screen/Screen";
import { ScreenHeader } from "@/design-system/components/ScreenHeader/ScreenHeader";

import { IntakeList } from "./components/IntakeList";
import { UnscheduledSection } from "./components/UnscheduledSection";
import { usePillboxData } from "@/features/pillbox/hooks/usePillboxData";

export function PillboxScreen() {
  const { intakes, asNeededMeds } = usePillboxData();

  return (
    <Screen>
      <ScreenHeader
        title="Pilulier"
        action={<IconButton icon="plus" accessibilityLabel="Nouvelle prise" />}
      />
      <IntakeList intakes={intakes} />
      <UnscheduledSection meds={asNeededMeds} />
    </Screen>
  );
}
