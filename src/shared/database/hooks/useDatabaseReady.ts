import { useEffect, useState } from "react";

import { database } from "@/shared/database/database";
import { migrateDatabase } from "@/shared/database/migrateDatabase";
import type { Database } from "@/shared/database/types";

type DatabaseState = { isReady: boolean; error?: Error };

export function useDatabaseReady(onMigrated?: (database: Database) => void): DatabaseState {
  const [state, setState] = useState<DatabaseState>({ isReady: false });

  useEffect(() => {
    migrateDatabase()
      .then(() => {
        onMigrated?.(database);
        setState({ isReady: true });
      })
      .catch((error: Error) => setState({ isReady: false, error }));
  }, [onMigrated]);

  return state;
}
