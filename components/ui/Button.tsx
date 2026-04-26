import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

import { theme } from "@/shared/constants/theme";

type Variant = "primary" | "outline" | "danger";

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
};

const variantStyles: Record<
  Variant,
  { bg: string; border: string; text: string }
> = {
  primary: {
    bg: theme.colors.primary,
    border: theme.colors.primary,
    text: "#ffffff",
  },
  outline: {
    bg: "#ffffff",
    border: theme.colors.primarySoft,
    text: theme.colors.primary,
  },
  danger: {
    bg: theme.colors.danger,
    border: theme.colors.danger,
    text: "#ffffff",
  },
};

export function Button({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
}: Props) {
  const colors = variantStyles[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          opacity: isDisabled ? 0.6 : pressed ? 0.85 : 1,
        },
      ]}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    ...theme.shadows.md,
  },
  label: {
    fontSize: 15,
    fontWeight: "800",
  },
});
