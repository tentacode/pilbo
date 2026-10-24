import type { ReactNode, Ref } from "react";
import { ScrollView, View } from "react-native";
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { spacing } from "../../tokens";
import { styles } from "./Sheet.styles";
import { SheetHeader } from "./SheetHeader";
import type { SheetAction } from "./SheetNavigationButton";

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
  const keyboard = useAnimatedKeyboard();
  const footerKeyboardStyle = useAnimatedStyle(() => ({
    paddingBottom: Math.max(keyboard.height.get(), insets.bottom) + spacing.medium,
  }));
  return (
    <View style={styles.sheet}>
      <SheetHeader title={title} leftAction={leftAction} rightAction={rightAction} />
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
