import Svg, { Path } from "react-native-svg";

const WHEEL_RADIUS = 20;

type ColorWheelProps = {
  colors: readonly string[];
};

function pointOnCircle(angle: number): string {
  const x = WHEEL_RADIUS + WHEEL_RADIUS * Math.sin(angle);
  const y = WHEEL_RADIUS - WHEEL_RADIUS * Math.cos(angle);
  return `${x} ${y}`;
}

export function ColorWheel({ colors }: ColorWheelProps) {
  const sliceAngle = (2 * Math.PI) / colors.length;
  return (
    <Svg width="100%" height="100%" viewBox="0 0 40 40" accessible={false}>
      {colors.map((color, index) => (
        <Path
          key={color}
          d={`M${WHEEL_RADIUS} ${WHEEL_RADIUS}L${pointOnCircle(index * sliceAngle)}A${WHEEL_RADIUS} ${WHEEL_RADIUS} 0 0 1 ${pointOnCircle((index + 1) * sliceAngle)}z`}
          fill={color}
        />
      ))}
    </Svg>
  );
}
