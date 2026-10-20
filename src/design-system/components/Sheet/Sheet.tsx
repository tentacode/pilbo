import { type ReactNode, type Ref, useState } from "react";
import { ScrollView, View } from "react-native";
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { spacing } from "../../tokens";
import { Text } from "../Text/Text";
import { styles } from "./Sheet.styles";
import { type SheetAction, SheetNavigationButton } from "./SheetNavigationButton";

type SheetProps = {
  title: string;
  leftAction: SheetAction;
  rightAction?: SheetAction;
  footer?: ReactNode;
  scrollReference?: Ref<ScrollView>;
  children: ReactNode;
};

export function Sheet({
  title,
  leftAction,
  rightAction,
  footer,
  scrollReference,
  children,
}: SheetProps) {
  const insets = useSafeAreaInsets();
  const [sideWidth, setSideWidth] = useState(0);
  const keyboard = useAnimatedKeyboard();
  const footerKeyboardStyle = useAnimatedStyle(() => ({
    paddingBottom: Math.max(keyboard.height.get(), insets.bottom) + spacing.medium,
  }));
  return (
    <View style={styles.sheet}>
      <View style={styles.header}>
        <View style={styles.grabber} />
        <View style={styles.navigation}>
          <View
            onLayout={(event) => setSideWidth(event.nativeEvent.layout.width)}
            style={styles.side}
          >
            <SheetNavigationButton {...leftAction} />
          </View>
          <Text variant="bodyBold" accessibilityRole="header" style={styles.title}>
            {title}
          </Text>
          <View style={[styles.side, styles.endSide, { minWidth: sideWidth }]}>
            {rightAction ? <SheetNavigationButton {...rightAction} /> : null}
          </View>
        </View>
      </View>
      <ScrollView
        ref={scrollReference}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
      {footer ? (
        <Animated.View style={[styles.footer, footerKeyboardStyle]}>{footer}</Animated.View>
      ) : null}
    </View>
  );
}
