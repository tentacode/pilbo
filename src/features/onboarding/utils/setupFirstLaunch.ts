import { seedDatabase } from "@/shared/database/seed";
import type { Database } from "@/shared/database/types";

import { useOnboardingStore } from "../store/onboardingStore";

type FirstLaunchOptions = {
  isDevVariant: boolean;
  isFirstLaunch: boolean;
};

export function setupFirstLaunch(
  database: Database,
  { isDevVariant, isFirstLaunch }: FirstLaunchOptions,
): void {
  if (!isDevVariant || !isFirstLaunch) {
    return;
  }

  seedDatabase(database, { withLogs: __DEV__ });
  useOnboardingStore.getState().setOnboardingDone(true);
}
