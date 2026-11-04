import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { sortIntakeMeds, type Intake } from "@/domain/intake";
import { database } from "@/shared/database/database";
import type { Database } from "@/shared/database/types";

import { getAllIntakes } from "@/features/pillbox/queries/getAllIntakes";

type PillboxData = {
  intakes: Intake[];
};

function readPillboxData(source: Database): PillboxData {
  return {
    intakes: getAllIntakes(source).map(sortIntakeMeds),
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
