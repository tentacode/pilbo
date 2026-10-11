import { Text as NativeText, type TextProps as NativeTextProps } from "react-native";

import { toneStyles, variantStyles } from "./Text.styles";

export type TextVariant = keyof typeof variantStyles;
export type TextTone = keyof typeof toneStyles;

type TextProps = NativeTextProps & {
  variant?: TextVariant;
  tone?: TextTone;
};

export function Text({ variant = "body", tone = "primary", style, ...props }: TextProps) {
  return <NativeText style={[variantStyles[variant], toneStyles[tone], style]} {...props} />;
}
