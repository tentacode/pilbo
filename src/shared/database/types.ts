import type { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";

export type Database = BaseSQLiteDatabase<"sync", unknown>;
