import Svg, { G } from "react-native-svg";

import type { PillDesign } from "@/domain/med";

import { sizes } from "../../tokens";
import { CapsulePill } from "./CapsulePill";
import { OvalPill } from "./OvalPill";
import { PILL_CENTER, PILL_VIEWBOX, pillScales } from "./Pill.styles";
import { RoundPill } from "./RoundPill";

type PillProps = {
  design: PillDesign;
  displaySize?: number;
};

export function Pill({ design, displaySize = sizes.pillInList }: PillProps) {
  const scale = pillScales[design.size];
  return (
    <Svg width={displaySize} height={displaySize} viewBox={PILL_VIEWBOX} accessible={false}>
      <G scale={scale} originX={PILL_CENTER} originY={PILL_CENTER}>
        <PillShape design={design} scale={scale} />
      </G>
    </Svg>
  );
}

function PillShape({ design, scale }: { design: PillDesign; scale: number }) {
  switch (design.shape) {
    case "round":
      return <RoundPill color={design.color} hasScoreLine={design.hasScoreLine} scale={scale} />;
    case "oval":
      return <OvalPill color={design.color} scale={scale} />;
    case "capsule":
      return (
        <CapsulePill
          firstHalfColor={design.firstHalfColor}
          secondHalfColor={design.secondHalfColor}
          scale={scale}
        />
      );
  }
}
