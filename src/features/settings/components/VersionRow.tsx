import { nativeApplicationVersion, nativeBuildVersion } from "expo-application";

import { Text } from "@/design-system/components/Text/Text";

import { formatAppVersion } from "../utils/formatters";
import { SettingsRow } from "./SettingsRow";

type VersionRowProps = {
  onPress: () => void;
};

export function VersionRow({ onPress }: VersionRowProps) {
  const version = formatAppVersion(nativeApplicationVersion, nativeBuildVersion);

  return (
    <SettingsRow label="Version" onPress={onPress} accessibilityLabel={`Version ${version}`}>
      <Text variant="body" tone="secondary">
        {version}
      </Text>
    </SettingsRow>
  );
}
