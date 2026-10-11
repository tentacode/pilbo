import type { ReactNode } from "react";
import { Circle, Path } from "react-native-svg";

export const iconShapes = {
  today: (
    <>
      <Circle cx={12} cy={12} r={4} />
      <Path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
    </>
  ),
  pillbox: (
    <>
      <Path d="M10.5 20.5a5 5 0 0 1-7-7l9-9a5 5 0 0 1 7 7z" />
      <Path d="M8.5 8.5l7 7" />
    </>
  ),
  stocks: (
    <>
      <Path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5z" />
      <Path d="M3.5 7.5L12 12l8.5-4.5M12 12v9" />
    </>
  ),
  settings: (
    <>
      <Path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
      <Circle cx={15} cy={7} r={2} />
      <Circle cx={9} cy={17} r={2} />
    </>
  ),
  plus: <Path d="M12 5v14M5 12h14" />,
  chevronRight: <Path d="M9.5 6l6 6-6 6" />,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof iconShapes;
