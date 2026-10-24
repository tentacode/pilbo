import type { TFunction } from "i18next";

import type { SegmentedControlOption } from "@/design-system/components/SegmentedControl/SegmentedControl";
import { REMINDER_INTERVALS_MINUTES } from "@/domain/intake";

export function reminderIntervalOptions(t: TFunction<"common">): SegmentedControlOption<number>[] {
  return REMINDER_INTERVALS_MINUTES.map((minutes) => ({
    value: minutes,
    label: t("{{minutes}} min", { minutes }),
    accessibilityLabel: t("{{count}} minutes", { count: minutes }),
  }));
}
