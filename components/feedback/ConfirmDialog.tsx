import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.dialog} onPress={() => undefined}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <View style={styles.button}>
              <Button
                label={cancelLabel}
                variant="outline"
                onPress={onCancel}
              />
            </View>
            <View style={styles.button}>
              <Button
                label={confirmLabel}
                variant="danger"
                onPress={onConfirm}
              />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.46)",
    justifyContent: "center",
    padding: 20,
  },
  dialog: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  message: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
  },
});
