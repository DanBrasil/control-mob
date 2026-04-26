import { forwardRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

type Props = TextInputProps & {
  label: string;
  error?: string;
};

export const Input = forwardRef<TextInput, Props>(function Input(
  { label, error, style, ...props },
  ref,
) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={ref}
        style={[styles.input, error ? styles.errorBorder : null, style]}
        placeholderTextColor="#94a3b8"
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    color: "#475569",
    fontWeight: "600",
  },
  input: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    fontSize: 15,
    color: "#0f172a",
  },
  errorBorder: {
    borderColor: "#dc2626",
  },
  errorText: {
    fontSize: 12,
    color: "#dc2626",
    fontWeight: "500",
  },
});
