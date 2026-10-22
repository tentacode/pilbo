import { useCallback, useState } from "react";
import type { LayoutChangeEvent } from "react-native";

export function useFitsInWidth(requiredWidth: number) {
  const [availableWidth, setAvailableWidth] = useState<number>();

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setAvailableWidth(event.nativeEvent.layout.width);
  }, []);

  const fits = availableWidth === undefined || availableWidth >= requiredWidth;

  return { onLayout, fits };
}
