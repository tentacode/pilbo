import { nativeApplicationVersion, nativeBuildVersion } from "expo-application";
import { useTranslation } from "react-i18next";

import { Text } from "@/design-system/components/Text/Text";

import { formatAppVersion } from "../utils/formatters";
import { SettingsRow } from "./SettingsRow";

type VersionRowProps = {
  onPress: () => void;
};

export function VersionRow({ onPress }: VersionRowProps) {
  const { t } = useTranslation("settings");
  const version = formatAppVersion(t, nativeApplicationVersion, nativeBuildVersion);

  return (
    <SettingsRow
      label={t("Version")}
      onPress={onPress}
      accessibilityLabel={t("Version {{version}}", { version })}
    >
      <Text variant="body" tone="secondary">
        {version}
      </Text>
    </SettingsRow>
  );
}
