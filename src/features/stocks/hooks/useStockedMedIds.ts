import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { database } from "@/shared/database/database";

import { getAllStocks } from "@/features/stocks/queries/getAllStocks";

function readStockedMedIds(): Set<string> {
  return new Set(getAllStocks(database).map(({ med }) => med.id));
}

export function useStockedMedIds(): Set<string> {
  const [medIds, setMedIds] = useState(readStockedMedIds);

  useFocusEffect(
    useCallback(() => {
      setMedIds(readStockedMedIds());
    }, []),
  );

  return medIds;
}
