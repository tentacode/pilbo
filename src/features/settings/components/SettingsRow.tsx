import type { ReactNode } from "react";
import { type AccessibilityRole, Pressable, View } from "react-native";

import { Icon } from "@/design-system/components/Icon/Icon";
import { Text, type TextTone } from "@/design-system/components/Text/Text";
import { useThemeColors } from "@/design-system/hooks/useThemeColors";

import { useSettingsRowLayout } from "../hooks/useSettingsRowLayout";
import { useStyles } from "./SettingsRow.styles";

type SettingsRowProps = {
  label: string;
  labelTone?: TextTone;
  children?: ReactNode;
  hasChevron?: boolean;
  isFullWidthControl?: boolean;
  onPress?: () => void;
  // When set, the row is read as a single element. Otherwise the control in children carries it.
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
  accessibilityHint?: string;
};

export function SettingsRow({
  label,
  labelTone = "primary",
  children,
  hasChevron = false,
  isFullWidthControl = false,
  onPress,
  accessibilityLabel,
  accessibilityRole,
  accessibilityHint,
}: SettingsRowProps) {
  const styles = useStyles();
  const themeColors = useThemeColors();
  const { onRowLayout, onTrailingLayout, isStacked: isOverflowing } = useSettingsRowLayout();
  const isStacked = isFullWidthControl || isOverflowing;
  const isGrouped = accessibilityLabel !== undefined;
  const hasTrailing = children !== undefined || hasChevron;

  const content = (
    <>
      <Text
        variant="bodyBold"
        tone={labelTone}
        accessibilityElementsHidden={!isGrouped}
        importantForAccessibility={isGrouped ? "auto" : "no-hide-descendants"}
        style={!isStacked && styles.inlineLabel}
      >
        {label}
      </Text>
      {hasTrailing ? (
        <View
          onLayout={isFullWidthControl ? undefined : onTrailingLayout}
          style={[
            styles.trailing,
            isStacked && styles.stackedTrailing,
            isFullWidthControl && styles.fullWidthTrailing,
          ]}
        >
          {children}
          {hasChevron ? <Icon name="chevronRight" color={themeColors.inkSecondary} /> : null}
        </View>
      ) : null}
    </>
  );

  const accessibilityProps = {
    accessible: isGrouped,
    accessibilityLabel,
    accessibilityRole,
    accessibilityHint,
  };

  if (onPress === undefined) {
    return (
      <View
        {...accessibilityProps}
        onLayout={onRowLayout}
        style={[styles.row, isStacked && styles.stackedRow]}
      >
        {content}
      </View>
    );
  }

  return (
    <Pressable
      {...accessibilityProps}
      onLayout={onRowLayout}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        isStacked && styles.stackedRow,
        pressed && styles.pressed,
      ]}
    >
      {content}
    </Pressable>
  );
}
