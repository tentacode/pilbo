import { sql } from "drizzle-orm";

import { medLogTable, medTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

import { type MedRecord, toMed } from "@/features/pillbox/queries/medRecord";
import type { MedLogOfDay } from "@/features/today/utils/todayTypes";

type MedLogRecord = {
  medLogId: string;
  takenAt: string;
  medId: string;
  medName: string;
  medStrength: string;
  medDetail: string;
  medDesign: string;
  medIsAsNeeded: number;
};

function toMedRecord(record: MedLogRecord): MedRecord {
  return {
    id: record.medId,
    name: record.medName,
    strength: record.medStrength,
    detail: record.medDetail,
    design: record.medDesign,
    isAsNeeded: record.medIsAsNeeded,
  };
}

export function getMedLogsOfDay(database: Database, localDate: string): MedLogOfDay[] {
  const records = database.all<MedLogRecord>(sql`
    SELECT
      ${medLogTable.id} AS medLogId,
      ${medLogTable.takenAt} AS takenAt,
      ${medTable.id} AS medId,
      ${medTable.name} AS medName,
      ${medTable.strength} AS medStrength,
      ${medTable.detail} AS medDetail,
      ${medTable.design} AS medDesign,
      ${medTable.isAsNeeded} AS medIsAsNeeded
    FROM ${medLogTable}
    INNER JOIN ${medTable} ON ${medTable.id} = ${medLogTable.medId}
    WHERE ${medLogTable.takenAt} LIKE ${localDate} || '%'
    ORDER BY ${medLogTable.takenAt}, ${medLogTable}.rowid
  `);
  return records.map((record) => ({
    id: record.medLogId,
    med: toMed(toMedRecord(record)),
    takenAt: record.takenAt,
  }));
}
