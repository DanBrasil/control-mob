import {
  PropsWithChildren,
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

type ToastType = "success" | "error" | "info";

type ToastOptions = {
  message: string;
  type?: ToastType;
  durationMs?: number;
};

export type ToastApi = {
  show: (options: ToastOptions) => void;
};

export const ToastContext = createContext<ToastApi | null>(null);

const toneMap: Record<ToastType, string> = {
  success: "#0f766e",
  error: "#b91c1c",
  info: "#1f4db8",
};

export function ToastProvider({ children }: PropsWithChildren) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<ToastType>("info");
  const opacity = useRef(new Animated.Value(0)).current;

  const show = useCallback(
    ({ message, type = "info", durationMs = 2200 }: ToastOptions) => {
      setMessage(message);
      setType(type);
      setVisible(true);

      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.delay(durationMs),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setVisible(false);
      });
    },
    [opacity],
  );

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {visible ? (
        <Animated.View style={[styles.container, { opacity }]}>
          <View style={[styles.toast, { borderLeftColor: toneMap[type] }]}>
            <Text style={styles.text}>{message}</Text>
          </View>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
    zIndex: 50,
  },
  toast: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderLeftWidth: 5,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 4,
  },
  text: {
    fontSize: 14,
    color: "#1f2937",
    fontWeight: "600",
  },
});
