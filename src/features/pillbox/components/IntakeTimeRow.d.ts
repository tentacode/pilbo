import type { Intake } from "@/domain/intake";

export type IntakeTimeRowProps = {
  time: Intake["time"];
  onChange: (time: Intake["time"]) => void;
  label?: string;
  accessibilityLabel?: string;
};

export declare function IntakeTimeRow(props: IntakeTimeRowProps): React.JSX.Element;
