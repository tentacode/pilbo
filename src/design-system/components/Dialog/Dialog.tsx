import { Modal, View } from "react-native";

import { useAccessibilityFocusOnMount } from "../../hooks/useAccessibilityFocusOnMount";
import { useReduceMotion } from "../../hooks/useReduceMotion";
import { Button } from "../Button/Button";
import { Icon } from "../Icon/Icon";
import type { IconName } from "../Icon/iconShapes";
import { Text } from "../Text/Text";
import { sizes } from "../../tokens";
import { styles, toneStyles } from "./Dialog.styles";

export type DialogTone = keyof typeof toneStyles;

export type DialogAction = {
  label: string;
  onPress: () => void;
};

type DialogProps = {
  isVisible: boolean;
  title: string;
  message?: string;
  icon?: IconName;
  tone?: DialogTone;
  confirmAction: DialogAction;
  cancelAction?: DialogAction;
  onRequestClose: () => void;
};

export function Dialog({ isVisible, onRequestClose, ...cardProps }: DialogProps) {
  const reduceMotion = useReduceMotion();
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType={reduceMotion ? "none" : "fade"}
      onRequestClose={onRequestClose}
    >
      <View style={styles.backdrop}>
        <DialogCard {...cardProps} />
      </View>
    </Modal>
  );
}

type DialogCardProps = Omit<DialogProps, "isVisible" | "onRequestClose">;

function DialogCard({
  title,
  message,
  icon,
  tone = "neutral",
  confirmAction,
  cancelAction,
}: DialogCardProps) {
  const titleReference = useAccessibilityFocusOnMount<View>();
  return (
    <View accessibilityViewIsModal style={styles.card}>
      {icon ? (
        <View style={[styles.iconBadge, toneStyles[tone]]}>
          <Icon name={icon} size={sizes.dialogIcon} />
        </View>
      ) : null}
      <View ref={titleReference} accessible accessibilityRole="header">
        <Text variant="heading" style={styles.text}>
          {title}
        </Text>
      </View>
      {message ? (
        <Text variant="callout" tone="secondary" style={styles.text}>
          {message}
        </Text>
      ) : null}
      <View style={styles.actions}>
        <Button label={confirmAction.label} onPress={confirmAction.onPress} />
        {cancelAction ? (
          <Button label={cancelAction.label} variant="text" onPress={cancelAction.onPress} />
        ) : null}
      </View>
    </View>
  );
}
