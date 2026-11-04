import { sql } from "drizzle-orm";

import {
  intakeLogTable,
  intakeMedTable,
  intakeTable,
  medLogTable,
  medTable,
  stockTable,
} from "./schema";
import { createTestDatabase, migrateTestDatabase } from "./testDatabase";
import { countRows } from "./testHelpers";
import type { Database } from "./types";

const DESIGN = JSON.stringify({ shape: "round", size: "medium", colors: ["#D6C9F5", "#D6C9F5"] });

function insertShippedData(database: Database): void {
  database.run(sql`
    INSERT INTO med (id, name, strength, detail, design, is_as_needed) VALUES
      ('lithium', 'Lithium', '250 mg', 'Avec le repas', ${DESIGN}, 0),
      ('doliprane', 'Doliprane', '500 mg', 'Si besoin', ${DESIGN}, 1)
  `);
  database.run(sql`
    INSERT INTO stock (med_id, quantity, box_size, low_stock_days) VALUES
      ('lithium', 18, 100, 7),
      ('doliprane', 12, 16, 7)
  `);
  database.run(sql`
    INSERT INTO intake (id, hour, minute, days, reminder_interval_minutes, created_on)
    VALUES ('morning', 8, 20, '["monday"]', 10, '2026-10-01')
  `);
  database.run(sql`
    INSERT INTO intake_med (intake_id, med_id, quantity) VALUES ('morning', 'lithium', 1)
  `);
  database.run(sql`
    INSERT INTO intake_log (id, intake_id, expected_intake_at, created_at, status)
    VALUES ('log', 'morning', '2026-10-05T08:20', '2026-10-05T08:25', 'taken')
  `);
  database.run(sql`
    INSERT INTO med_log (id, med_id, taken_at) VALUES ('taken', 'doliprane', '2026-10-05T15:40')
  `);
}

describe("migrations", () => {
  it("keeps the data of the shipped schema when applying the current migration", () => {
    const database = createTestDatabase({
      seed: false,
      lastMigrationTag: "0000_common_norrin_radd",
    });
    insertShippedData(database);

    migrateTestDatabase(database);

    expect(countRows(database, medTable)).toBe(2);
    expect(countRows(database, stockTable)).toBe(2);
    expect(countRows(database, intakeTable)).toBe(1);
    expect(countRows(database, intakeMedTable)).toBe(1);
    expect(countRows(database, intakeLogTable)).toBe(1);
    expect(countRows(database, medLogTable)).toBe(1);
    expect(
      database.all(sql`
        SELECT ${medTable.id} AS id, ${medTable.archivedOn} AS archivedOn
        FROM ${medTable}
        ORDER BY ${medTable.id}
      `),
    ).toEqual([
      { id: "doliprane", archivedOn: null },
      { id: "lithium", archivedOn: null },
    ]);
  });
});
