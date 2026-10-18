import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import { useEffect, useState } from "react";

import { database } from "@/shared/database/database";
import migrations from "@/shared/database/migrations/migrations";
import type { Database } from "@/shared/database/types";

type DatabaseState = { isReady: boolean; error?: Error };

export function useDatabaseReady(onMigrated?: (database: Database) => void): DatabaseState {
  const [state, setState] = useState<DatabaseState>({ isReady: false });

  useEffect(() => {
    migrate(database, migrations)
      .then(() => {
        onMigrated?.(database);
        setState({ isReady: true });
      })
      .catch((error: Error) => setState({ isReady: false, error }));
  }, [onMigrated]);

  return state;
}
