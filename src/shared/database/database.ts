import { drizzle } from "drizzle-orm/expo-sqlite";
import { addDatabaseChangeListener, openDatabaseSync } from "expo-sqlite";

const DATABASE_NAME = "pilbo.db";

const expoDatabase = openDatabaseSync(DATABASE_NAME, { enableChangeListener: true });
expoDatabase.execSync("PRAGMA foreign_keys = ON;");

export const database = drizzle(expoDatabase);

export function subscribeToDatabaseChanges(listener: () => void): () => void {
  const subscription = addDatabaseChangeListener(listener);
  return () => subscription.remove();
}
