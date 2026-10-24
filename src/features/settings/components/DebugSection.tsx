import { DeleteDataRow } from "./DeleteDataRow";
import { ResetWithTestDataRow } from "./ResetWithTestDataRow";
import { SettingsSection } from "./SettingsSection";
import { SimulateErrorRow } from "./SimulateErrorRow";
import { useTranslation } from "react-i18next";

export function DebugSection() {
  const { t } = useTranslation("settings");
  return (
    <SettingsSection title={t("Debug")}>
      <DeleteDataRow />
      <ResetWithTestDataRow />
      <SimulateErrorRow />
    </SettingsSection>
  );
}
