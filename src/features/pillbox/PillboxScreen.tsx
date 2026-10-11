import { IconButton } from "@/design-system/components/IconButton/IconButton";
import { Screen } from "@/design-system/components/Screen/Screen";
import { ScreenHeader } from "@/design-system/components/ScreenHeader/ScreenHeader";

import { IntakeList } from "./components/IntakeList";
import { UnscheduledSection } from "./components/UnscheduledSection";
import { hydroxyzine25, intakes } from "./fixtures";

export function PillboxScreen() {
  return (
    <Screen>
      <ScreenHeader
        title="Pilulier"
        action={<IconButton icon="plus" accessibilityLabel="Nouvelle prise" />}
      />
      <IntakeList intakes={intakes} />
      <UnscheduledSection meds={[hydroxyzine25]} />
    </Screen>
  );
}
