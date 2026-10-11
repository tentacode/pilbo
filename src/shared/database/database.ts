import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

const DATABASE_NAME = "pilbo.db";

const expoDatabase = openDatabaseSync(DATABASE_NAME);
expoDatabase.execSync("PRAGMA foreign_keys = ON;");

export const database = drizzle(expoDatabase);
