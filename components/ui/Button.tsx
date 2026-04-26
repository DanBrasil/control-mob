import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

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
  primary: { bg: "#1f4db8", border: "#1f4db8", text: "#ffffff" },
  outline: { bg: "#ffffff", border: "#1f4db8", text: "#1f4db8" },
  danger: { bg: "#b91c1c", border: "#b91c1c", text: "#ffffff" },
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
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
  },
});
