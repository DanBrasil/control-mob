import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { theme } from "@/shared/constants/theme";

type Props = {
  label?: string;
};

export function LoadingState({ label = "Carregando..." }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={theme.colors.primary} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    gap: 8,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
  },
  label: {
    fontSize: 14,
    color: theme.colors.textMuted,
    fontWeight: "600",
  },
});
