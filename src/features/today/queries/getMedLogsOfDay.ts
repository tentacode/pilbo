import { type SQL, sql } from "drizzle-orm";

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
};

function toMedRecord(record: MedLogRecord): MedRecord {
  return {
    id: record.medId,
    name: record.medName,
    strength: record.medStrength,
    detail: record.medDetail,
    design: record.medDesign,
  };
}

export function selectMedLogs(database: Database, condition: SQL): MedLogOfDay[] {
  const records = database.all<MedLogRecord>(sql`
    SELECT
      ${medLogTable.id} AS medLogId,
      ${medLogTable.takenAt} AS takenAt,
      ${medTable.id} AS medId,
      ${medTable.name} AS medName,
      ${medTable.strength} AS medStrength,
      ${medTable.detail} AS medDetail,
      ${medTable.design} AS medDesign
    FROM ${medLogTable}
    INNER JOIN ${medTable} ON ${medTable.id} = ${medLogTable.medId}
    WHERE ${condition}
    ORDER BY ${medLogTable.takenAt}, ${medLogTable}.rowid
  `);
  return records.map((record) => ({
    id: record.medLogId,
    med: toMed(toMedRecord(record)),
    takenAt: record.takenAt,
  }));
}

export function getMedLogsOfDay(database: Database, localDate: string): MedLogOfDay[] {
  return selectMedLogs(database, sql`${medLogTable.takenAt} LIKE ${localDate} || '%'`);
}
