import { Text } from "@/design-system/components/Text/Text";

import { styles } from "./TodaySectionTitle.styles";

type TodaySectionTitleProps = {
  title: string;
};

export function TodaySectionTitle({ title }: TodaySectionTitleProps) {
  return (
    <Text variant="heading" accessibilityRole="header" style={styles.title}>
      {title}
    </Text>
  );
}
