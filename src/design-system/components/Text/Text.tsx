import { Text as NativeText, type TextProps as NativeTextProps } from "react-native";

import { maximumFontScale } from "../../tokens";
import { useToneStyles, variantStyles } from "./Text.styles";

export type TextVariant = keyof typeof variantStyles;
export type TextTone = keyof ReturnType<typeof useToneStyles>;

type TextProps = NativeTextProps & {
  variant?: TextVariant;
  tone?: TextTone;
};

const variantMaximumFontScales: Partial<Record<TextVariant, number>> = {
  title: maximumFontScale.title,
};

export function Text({ variant = "body", tone = "primary", style, ...props }: TextProps) {
  const toneStyles = useToneStyles();
  return (
    <NativeText
      maxFontSizeMultiplier={variantMaximumFontScales[variant]}
      style={[variantStyles[variant], toneStyles[tone], style]}
      {...props}
    />
  );
}
