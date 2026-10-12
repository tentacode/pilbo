import { intakeTable, medTable } from "./schema";
import type { Database } from "./types";

export function clearDatabase(database: Database): void {
  database.transaction((transaction) => {
    transaction.delete(intakeTable).run();
    transaction.delete(medTable).run();
  });
}
