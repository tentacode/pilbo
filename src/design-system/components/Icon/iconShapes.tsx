import type { ReactNode } from "react";
import { Circle, G, Path, Rect } from "react-native-svg";

const sunShape = (
  <>
    <Circle cx={12} cy={12} r={4} />
    <Path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
  </>
);

export const iconShapes = {
  today: sunShape,
  sun: sunShape,
  moon: <Path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />,
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
  minus: <Path d="M6 12h12" />,
  close: <Path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  chevronRight: <Path d="M9.5 6l6 6-6 6" />,
  chevronLeft: <Path d="M14.5 6l-6 6 6 6" />,
  calendar: (
    <>
      <Rect x={4} y={5.5} width={16} height={14.5} rx={3} />
      <Path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
    </>
  ),
  pencil: <Path d="M15.5 5.5l3 3L9 18l-4 1 1-4z" />,
  trash: (
    <>
      <Path d="M4.5 7h15M9.5 7V4.5h5V7" />
      <Path d="M6.5 7l1 12.5h9l1-12.5" />
      <Path d="M10 11v5M14 11v5" />
    </>
  ),
  clock: (
    <>
      <Circle cx={12} cy={12} r={9} />
      <Path d="M12 7.5V12l3 2" />
    </>
  ),
  alert: (
    <>
      <Circle cx={12} cy={12} r={9} />
      <Path d="M12 7.5v5.2" />
      <Path d="M12 16.4v.1" />
    </>
  ),
  check: <Path d="M5 12.5l4.5 4.5L19 7.5" />,
  lock: (
    <>
      <Rect x={5} y={10.5} width={14} height={10} rx={3} />
      <Path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </>
  ),
  pillAlert: (
    <>
      <G rotation={-45} originX={9} originY={13}>
        <Rect x={2} y={9.5} width={14} height={7} rx={3.5} />
        <Path d="M9 9.5v7" />
      </G>
      <Path d="M19.5 7v8" />
      <Path d="M19.5 19v.1" />
    </>
  ),
  checkCircle: (
    <>
      <Circle cx={12} cy={12} r={9} />
      <Path d="M8 12.4l2.8 2.8L16 9.6" />
    </>
  ),
  dashCircle: (
    <>
      <Circle cx={12} cy={12} r={9} />
      <Path d="M8 12h8" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof iconShapes;
