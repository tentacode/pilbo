import { sql } from "drizzle-orm";

import { type Intake, intakeDateOn } from "@/domain/intake";
import {
  fromLocalDate,
  type IntakeLog,
  type IntakeLogStatus,
  toLocalDateTime,
} from "@/domain/intakeLog";
import { intakeLogTable } from "@/shared/database/schema";
import type { Database } from "@/shared/database/types";

import { decreaseStocks } from "@/features/stocks/queries/decreaseStocks";
import { increaseStock } from "@/features/stocks/queries/increaseStock";
import { insertIntakeLog } from "./insertIntakeLog";

export type EditedIntakeStatus = IntakeLogStatus | "none";

export type IntakeLogChange = {
  intake: Intake;
  localDate: string;
  previousLog?: IntakeLog;
  status: EditedIntakeStatus;
  takenTime: Intake["time"];
};

function createdAtOf({ intake, localDate, previousLog, status, takenTime }: IntakeLogChange) {
  const day = fromLocalDate(localDate);
  if (status === "taken") {
    return toLocalDateTime(intakeDateOn(day, takenTime));
  }
  return previousLog?.createdAt ?? toLocalDateTime(intakeDateOn(day, intake.time));
}

function writeLog(database: Database, change: IntakeLogChange): void {
  const { intake, localDate, previousLog, status } = change;
  if (status === "none") {
    if (previousLog !== undefined) {
      database
        .delete(intakeLogTable)
        .where(sql`${intakeLogTable.id} = ${previousLog.id}`)
        .run();
    }
    return;
  }
  const createdAt = createdAtOf(change);
  if (previousLog === undefined) {
    insertIntakeLog(database, {
      intakeId: intake.id,
      status,
      expectedIntakeAt: toLocalDateTime(intakeDateOn(fromLocalDate(localDate), intake.time)),
      createdAt,
    });
    return;
  }
  database
    .update(intakeLogTable)
    .set({ status, createdAt })
    .where(sql`${intakeLogTable.id} = ${previousLog.id}`)
    .run();
}

function updateStocks(database: Database, { intake, previousLog, status }: IntakeLogChange) {
  const wasTaken = previousLog?.status === "taken";
  const isTaken = status === "taken";
  if (wasTaken && !isTaken) {
    for (const { med, quantity } of intake.medQuantities) {
      increaseStock(database, med.id, quantity);
    }
  } else if (!wasTaken && isTaken) {
    decreaseStocks(
      database,
      intake.medQuantities.map(({ med, quantity }) => ({ medId: med.id, quantity })),
    );
  }
}

export function saveIntakeLogChange(database: Database, change: IntakeLogChange): void {
  database.transaction((transaction) => {
    writeLog(transaction, change);
    updateStocks(transaction, change);
  });
}
