import { StyleSheet, Text } from "react-native";

import { Card } from "@/components/ui/Card";

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
    fontSize: 18,
    color: "#0f172a",
    fontWeight: "800",
  },
  notice: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 19,
  },
});
