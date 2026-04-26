import { StyleSheet, Text } from "react-native";

import { Card } from "@/components/ui/Card";
import { theme } from "@/shared/constants/theme";

type Props = {
  notice: string;
};

export function PrivacySection({ notice }: Props) {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Privacidade local</Text>
      <Text style={styles.notice}>{notice}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 8,
  },
  title: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: "800",
  },
  notice: {
    fontSize: 13,
    color: theme.colors.textMuted,
    lineHeight: 19,
  },
});
