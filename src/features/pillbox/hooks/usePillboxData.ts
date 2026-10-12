import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { sortIntakeMeds, type Intake } from "@/domain/intake";
import type { Med } from "@/domain/med";
import { database } from "@/shared/database/database";
import type { Database } from "@/shared/database/types";

import { getAllIntakes } from "@/features/pillbox/queries/getAllIntakes";
import { getAsNeededMeds } from "@/features/pillbox/queries/getAsNeededMeds";
import { sortMeds } from "@/features/pillbox/utils/sorters";

type PillboxData = {
  intakes: Intake[];
  asNeededMeds: Med[];
};

function readPillboxData(source: Database): PillboxData {
  return {
    intakes: getAllIntakes(source).map(sortIntakeMeds),
    asNeededMeds: sortMeds(getAsNeededMeds(source)),
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
