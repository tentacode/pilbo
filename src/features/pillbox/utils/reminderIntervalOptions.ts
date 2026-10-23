import type { SegmentedControlOption } from "@/design-system/components/SegmentedControl/SegmentedControl";
import { REMINDER_INTERVALS_MINUTES } from "@/domain/intake";

export const REMINDER_INTERVAL_OPTIONS: SegmentedControlOption<number>[] =
  REMINDER_INTERVALS_MINUTES.map((minutes) => ({
    value: minutes,
    label: `${minutes} min`,
    accessibilityLabel: `${minutes} minutes`,
  }));
