import type { ColorValue } from "react-native";
import type { ReactNode } from "react";
import { Circle, Ellipse, G, Path, Rect } from "react-native-svg";

import { colors } from "../../tokens";
import { illustrationStrokes as strokes } from "./illustrationStrokes";

const PILL_VIEWBOX_SIZE = 40;
const PILL_TILT = "rotate(-35 20 20)";

type Placement = {
  x: number;
  y: number;
  size?: number;
};

type SingleColorPillProps = Placement & { color: ColorValue };

type CapsulePillProps = Placement & {
  firstHalfColor: ColorValue;
  secondHalfColor: ColorValue;
  tilt?: number;
};

function PlacedPill({
  x,
  y,
  size = PILL_VIEWBOX_SIZE,
  children,
}: Placement & { children: ReactNode }) {
  return <G transform={`translate(${x} ${y}) scale(${size / PILL_VIEWBOX_SIZE})`}>{children}</G>;
}

export function IllustrationRoundPill({ color, ...placement }: SingleColorPillProps) {
  return (
    <PlacedPill {...placement}>
      <Circle cx={20} cy={20} r={13} fill={color} {...strokes.pillOutline} />
      <Path d="M11 20h18" {...strokes.pillScoreLine} />
      <Path d="M12.8 14.6a9 9 0 0 1 4.6-3.9" {...strokes.pillHighlight} />
    </PlacedPill>
  );
}

export function IllustrationSmallRoundPill({ color, ...placement }: SingleColorPillProps) {
  return (
    <PlacedPill {...placement}>
      <Circle cx={20} cy={20} r={9} fill={color} {...strokes.pillOutline} />
      <Path d="M15.2 17a5.6 5.6 0 0 1 3-2.8" {...strokes.pillHighlight} />
    </PlacedPill>
  );
}

export function IllustrationTabletPill({ color, ...placement }: SingleColorPillProps) {
  return (
    <PlacedPill {...placement}>
      <G transform={PILL_TILT}>
        <Rect x={5} y={13} width={30} height={14} rx={7} fill={color} {...strokes.pillOutline} />
        <Path d="M20 16v8" {...strokes.pillScoreLine} />
        <Path d="M10.5 17.3h5" {...strokes.pillHighlight} />
      </G>
    </PlacedPill>
  );
}

export function IllustrationCapsulePill({
  firstHalfColor,
  secondHalfColor,
  tilt = -35,
  ...placement
}: CapsulePillProps) {
  return (
    <PlacedPill {...placement}>
      <G transform={`rotate(${tilt} 20 20)`}>
        <Path d="M20 13.5h-7.5a6.5 6.5 0 0 0 0 13H20z" fill={firstHalfColor} />
        <Path d="M20 13.5h7.5a6.5 6.5 0 0 1 0 13H20z" fill={secondHalfColor} />
        <Rect x={6} y={13.5} width={28} height={13} rx={6.5} {...strokes.pillOutline} fill="none" />
        <Path d="M20 13.5v13" {...strokes.pillJunction} />
        <Path d="M10.5 17.2h5" {...strokes.pillHighlight} />
      </G>
    </PlacedPill>
  );
}

export function IllustrationOvalPill({ color, ...placement }: SingleColorPillProps) {
  return (
    <PlacedPill {...placement}>
      <G transform={PILL_TILT}>
        <Ellipse cx={20} cy={20} rx={12} ry={8.5} fill={color} {...strokes.pillOutline} />
      </G>
      <G transform="rotate(-35 15.6 17.6)">
        <Ellipse cx={15.6} cy={17.6} rx={3.4} ry={1.7} fill={colors.pillHighlight} opacity={0.8} />
      </G>
    </PlacedPill>
  );
}
