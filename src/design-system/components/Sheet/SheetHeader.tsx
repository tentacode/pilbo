import { useCallback, useState } from "react";
import { type LayoutChangeEvent, View } from "react-native";

import { useFitsInWidth } from "../../hooks/useFitsInWidth";
import { spacing } from "../../tokens";
import { Text } from "../Text/Text";
import { styles } from "./SheetHeader.styles";
import { type SheetAction, SheetNavigationButton } from "./SheetNavigationButton";

type SheetHeaderProps = {
  title: string;
  leftAction: SheetAction;
  rightAction?: SheetAction;
};

export function SheetHeader({ title, leftAction, rightAction }: SheetHeaderProps) {
  const [sideWidth, setSideWidth] = useState(0);
  const [longestWordWidth, setLongestWordWidth] = useState(0);
  const { onLayout, fits } = useFitsInWidth(sideWidth * 2 + spacing.small * 2 + longestWordWidth);

  const onLongestWordLayout = useCallback((event: LayoutChangeEvent) => {
    setLongestWordWidth(event.nativeEvent.layout.width);
  }, []);

  const titleText = (
    <Text
      variant="bodyBold"
      accessibilityRole="header"
      style={fits ? styles.title : styles.stackedTitle}
    >
      {title}
    </Text>
  );

  return (
    <View style={styles.header}>
      <View style={styles.grabber} />
      <View testID="sheet-navigation" onLayout={onLayout} style={styles.navigation}>
        <View
          testID="sheet-start-side"
          onLayout={(event) => setSideWidth(event.nativeEvent.layout.width)}
          style={styles.side}
        >
          <SheetNavigationButton {...leftAction} />
        </View>
        {fits ? titleText : <View style={styles.spacer} />}
        <View style={[styles.side, styles.endSide, { minWidth: sideWidth }]}>
          {rightAction ? <SheetNavigationButton {...rightAction} /> : null}
        </View>
      </View>
      {fits ? null : titleText}
      {/* Invisible copy of the words without width constraint: its width is the longest word one. */}
      <View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.measureContainer}
      >
        <View testID="sheet-title-measure" onLayout={onLongestWordLayout}>
          {title.split(" ").map((word, index) => (
            <Text key={`${word}-${index}`} variant="bodyBold">
              {word}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}
