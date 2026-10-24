import { intakeLogTable, intakeTable, medLogTable, medTable, stockTable } from "./schema";
import type { Database } from "./types";

export function clearDatabase(database: Database): void {
  database.transaction((transaction) => {
    transaction.delete(intakeLogTable).run();
    transaction.delete(intakeTable).run();
    transaction.delete(medLogTable).run();
    transaction.delete(stockTable).run();
    transaction.delete(medTable).run();
  });
}
