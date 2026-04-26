import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type Props = {
  label?: string;
};

export function LoadingState({ label = "Carregando..." }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color="#1f4db8" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: "#475569",
  },
});
