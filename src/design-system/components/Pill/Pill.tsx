import Svg, { G } from "react-native-svg";

import type { PillDesign } from "@/domain/med";

import { sizes } from "../../tokens";
import { CapsulePill } from "./CapsulePill";
import { OvalPill } from "./OvalPill";
import { outlineRatioFor, PILL_CENTER, PILL_VIEWBOX, pillScales } from "./Pill.styles";
import { RoundPill } from "./RoundPill";
import { SoftgelPill } from "./SoftgelPill";

type PillProps = {
  design: PillDesign;
  displaySize?: number;
};

export function Pill({ design, displaySize = sizes.pillInList }: PillProps) {
  const scale = pillScales[design.size];
  return (
    <Svg width={displaySize} height={displaySize} viewBox={PILL_VIEWBOX} accessible={false}>
      <G scale={scale} originX={PILL_CENTER} originY={PILL_CENTER}>
        <PillShape design={design} scale={scale} outlineRatio={outlineRatioFor(displaySize)} />
      </G>
    </Svg>
  );
}

type PillShapeProps = {
  design: PillDesign;
  scale: number;
  outlineRatio: number;
};

function PillShape({ design, ...strokeProps }: PillShapeProps) {
  switch (design.shape) {
    case "round":
      return <RoundPill colors={design.colors} {...strokeProps} />;
    case "oval":
      return <OvalPill colors={design.colors} {...strokeProps} />;
    case "capsule":
      return <CapsulePill colors={design.colors} {...strokeProps} />;
    case "softgel":
      return <SoftgelPill colors={design.colors} {...strokeProps} />;
  }
}
