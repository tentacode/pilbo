import { Modal, Pressable, View } from "react-native";
import Animated from "react-native-reanimated";

import { useAccessibilityFocusOnMount } from "../../hooks/useAccessibilityFocusOnMount";
import { useBottomSafeSpacing } from "../../hooks/useBottomSafeSpacing";
import { useReduceMotion } from "../../hooks/useReduceMotion";
import { Button } from "../Button/Button";
import { Text } from "../Text/Text";
import { useStyles } from "./ActionSheet.styles";
import { useSlideUp } from "./useSlideUp";

export type ActionSheetAction = {
  label: string;
  onPress: () => void;
};

type ActionSheetProps = {
  isVisible: boolean;
  title: string;
  message?: string;
  actions: ActionSheetAction[];
  cancelLabel: string;
  onRequestClose: () => void;
};

export function ActionSheet({ isVisible, onRequestClose, ...panelProps }: ActionSheetProps) {
  const styles = useStyles();
  const reduceMotion = useReduceMotion();
  return (
    <Modal
      visible={isVisible}
      transparent
      statusBarTranslucent
      navigationBarTranslucent
      animationType={reduceMotion ? "none" : "fade"}
      onRequestClose={onRequestClose}
    >
      <View style={styles.backdrop}>
        <Pressable
          accessible={false}
          importantForAccessibility="no"
          style={styles.dismissArea}
          onPress={onRequestClose}
        />
        <ActionSheetPanel {...panelProps} onRequestClose={onRequestClose} />
      </View>
    </Modal>
  );
}

type ActionSheetPanelProps = Omit<ActionSheetProps, "isVisible">;

function ActionSheetPanel({
  title,
  message,
  actions,
  cancelLabel,
  onRequestClose,
}: ActionSheetPanelProps) {
  const styles = useStyles();
  const bottomSafeSpacing = useBottomSafeSpacing();
  const slideStyle = useSlideUp();
  const titleReference = useAccessibilityFocusOnMount<View>();
  return (
    <Animated.View
      accessibilityViewIsModal
      onAccessibilityEscape={onRequestClose}
      style={[styles.panel, { paddingBottom: bottomSafeSpacing }, slideStyle]}
    >
      <View ref={titleReference} accessible accessibilityRole="header">
        <Text variant="heading">{title}</Text>
      </View>
      {message ? (
        <Text variant="callout" tone="secondary">
          {message}
        </Text>
      ) : null}
      <View style={styles.actions}>
        {actions.map(({ label, onPress }) => (
          <Button key={label} label={label} variant="secondary" size="large" onPress={onPress} />
        ))}
        <Button label={cancelLabel} variant="text" onPress={onRequestClose} />
      </View>
    </Animated.View>
  );
}
