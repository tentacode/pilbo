import { DeleteDataRow } from "./DeleteDataRow";
import { ResetWithTestDataRow } from "./ResetWithTestDataRow";
import { SettingsSection } from "./SettingsSection";
import { SimulateErrorRow } from "./SimulateErrorRow";

export function DebugSection() {
  return (
    <SettingsSection title="Debug">
      <DeleteDataRow />
      <ResetWithTestDataRow />
      <SimulateErrorRow />
    </SettingsSection>
  );
}
