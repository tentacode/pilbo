import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

import type { Weekday } from "@/domain/intake";
import type { IntakeLogStatus } from "@/domain/intakeLog";
import type { PillDesign } from "@/domain/med";

function generateId(): string {
  // Lazy require: drizzle-kit loads this schema in Node, where React Native code cannot be parsed.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { randomUUID } = require("expo-crypto") as typeof import("expo-crypto");
  return randomUUID();
}

export const medTable = sqliteTable("med", {
  id: text("id").primaryKey().$defaultFn(generateId),
  name: text("name").notNull(),
  strength: text("strength").notNull(),
  design: text("design", { mode: "json" }).$type<PillDesign>().notNull(),
  isAsNeeded: integer("is_as_needed", { mode: "boolean" }).notNull().default(false),
});

export const intakeTable = sqliteTable("intake", {
  id: text("id").primaryKey().$defaultFn(generateId),
  hour: integer("hour").notNull(),
  minute: integer("minute").notNull(),
  days: text("days", { mode: "json" }).$type<Weekday[]>().notNull(),
  reminderIntervalMinutes: integer("reminder_interval_minutes").notNull(),
  isArchived: integer("is_archived", { mode: "boolean" }).notNull().default(false),
});

export const intakeMedTable = sqliteTable(
  "intake_med",
  {
    intakeId: text("intake_id")
      .notNull()
      .references(() => intakeTable.id, { onDelete: "cascade" }),
    medId: text("med_id")
      .notNull()
      .references(() => medTable.id, { onDelete: "restrict" }),
    quantity: integer("quantity").notNull(),
  },
  (table) => [primaryKey({ columns: [table.intakeId, table.medId] })],
);

export const intakeLogTable = sqliteTable("intake_log", {
  id: text("id").primaryKey().$defaultFn(generateId),
  intakeId: text("intake_id")
    .notNull()
    .references(() => intakeTable.id, { onDelete: "restrict" }),
  expectedIntakeAt: text("expected_intake_at").notNull(),
  createdAt: text("created_at").notNull(),
  status: text("status").$type<IntakeLogStatus>().notNull(),
});

export type MedRow = typeof medTable.$inferSelect;
export type NewMedRow = typeof medTable.$inferInsert;
export type IntakeRow = typeof intakeTable.$inferSelect;
export type NewIntakeRow = typeof intakeTable.$inferInsert;
export type IntakeMedRow = typeof intakeMedTable.$inferSelect;
export type NewIntakeMedRow = typeof intakeMedTable.$inferInsert;
export type IntakeLogRow = typeof intakeLogTable.$inferSelect;
export type NewIntakeLogRow = typeof intakeLogTable.$inferInsert;
