import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import type { Med } from "@/domain/med";
import { database } from "@/shared/database/database";

import { getAllMeds } from "@/features/pillbox/queries/getAllMeds";
import { sortMeds } from "@/features/pillbox/utils/sorters";

export function useAllMeds(): Med[] {
  const [meds, setMeds] = useState(() => sortMeds(getAllMeds(database)));

  useFocusEffect(
    useCallback(() => {
      setMeds(sortMeds(getAllMeds(database)));
    }, []),
  );

  return meds;
}
