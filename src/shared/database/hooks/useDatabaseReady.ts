import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import { useEffect, useState } from "react";

import { database } from "@/shared/database/database";
import migrations from "@/shared/database/migrations/migrations";
import { seedDatabase } from "@/shared/database/seed";

type DatabaseState = { isReady: boolean; error?: Error };

export function useDatabaseReady(): DatabaseState {
  const [state, setState] = useState<DatabaseState>({ isReady: false });

  useEffect(() => {
    migrate(database, migrations)
      .then(() => {
        seedDatabase(database);
        setState({ isReady: true });
      })
      .catch((error: Error) => setState({ isReady: false, error }));
  }, []);

  return state;
}
