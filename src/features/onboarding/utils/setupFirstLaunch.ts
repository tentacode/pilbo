import { seedDatabase } from "@/shared/database/seed";
import type { Database } from "@/shared/database/types";

import { useOnboardingStore } from "../store/onboardingStore";

type FirstLaunchOptions = {
  isDebugMode: boolean;
  isFirstLaunch: boolean;
};

export function setupFirstLaunch(
  database: Database,
  { isDebugMode, isFirstLaunch }: FirstLaunchOptions,
): void {
  if (!isDebugMode || !isFirstLaunch) {
    return;
  }

  seedDatabase(database, { withLogs: __DEV__ });
  useOnboardingStore.getState().setOnboardingDone(true);
}
