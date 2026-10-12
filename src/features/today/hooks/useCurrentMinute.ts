import { useEffect, useState } from "react";
import { AppState } from "react-native";

const MILLISECONDS_PER_MINUTE = 60_000;

function millisecondsUntilNextMinute(date: Date): number {
  return MILLISECONDS_PER_MINUTE - (date.getTime() % MILLISECONDS_PER_MINUTE);
}

export function useCurrentMinute(): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    function refresh() {
      const current = new Date();
      setNow(current);
      clearTimeout(timeout);
      timeout = setTimeout(refresh, millisecondsUntilNextMinute(current));
    }

    timeout = setTimeout(refresh, millisecondsUntilNextMinute(new Date()));
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        refresh();
      }
    });

    return () => {
      clearTimeout(timeout);
      subscription.remove();
    };
  }, []);

  return now;
}
