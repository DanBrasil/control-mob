import { StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8fbff",
    borderWidth: 1,
    borderColor: "#dbe4f0",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  description: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
  },
});
