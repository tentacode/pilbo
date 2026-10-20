import type { Med } from "@/domain/med";
import { medTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

export function insertMed(database: Database, med: Omit<Med, "id">): Med {
  const { id } = database.insert(medTable).values(med).returning({ id: medTable.id }).get();
  return { id, ...med };
}
