import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { sortIntakeMeds, type Intake } from "@/domain/intake";
import { toLocalDate } from "@/domain/intakeLog";
import { database } from "@/shared/database/database";
import type { Database } from "@/shared/database/types";

import { getAllIntakes } from "@/features/pillbox/queries/getAllIntakes";
import { nextIntakeDatesOf } from "@/features/pillbox/utils/nextIntakes";
import { getIntakeLogsOfDay } from "@/features/today/queries/getIntakeLogsOfDay";

type PillboxData = {
  intakes: Intake[];
  nextIntakeDates: Map<string, Date | null>;
  now: Date;
};

function readPillboxData(source: Database): PillboxData {
  const now = new Date();
  const intakes = getAllIntakes(source).map(sortIntakeMeds);
  return {
    intakes,
    nextIntakeDates: nextIntakeDatesOf(intakes, getIntakeLogsOfDay(source, toLocalDate(now)), now),
    now,
  };
}

export function usePillboxData(): PillboxData {
  const [data, setData] = useState(() => readPillboxData(database));

  useFocusEffect(
    useCallback(() => {
      setData(readPillboxData(database));
    }, []),
  );

  return data;
}
