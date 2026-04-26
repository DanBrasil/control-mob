import { PropsWithChildren, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { LoadingState } from "@/components/feedback/LoadingState";
import { ToastProvider } from "@/components/feedback/Toast";
import { Button } from "@/components/ui/Button";
import { bootstrapDatabase } from "@/services/database";

type BootstrapState = "loading" | "error" | "ready";

export function AppProviders({ children }: PropsWithChildren) {
  const [state, setState] = useState<BootstrapState>("loading");

  const load = async () => {
    setState("loading");

    try {
      await bootstrapDatabase();
      setState("ready");
    } catch (error) {
      console.error("Erro ao inicializar banco de dados:", error);
      setState("error");
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (state === "loading") {
    return (
      <SafeAreaProvider>
        <View style={styles.center}>
          <LoadingState label="Preparando ambiente local..." />
        </View>
      </SafeAreaProvider>
    );
  }

  if (state === "error") {
    return (
      <SafeAreaProvider>
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Falha ao iniciar banco local</Text>
          <Text style={styles.errorText}>
            Verifique permissões do dispositivo e tente novamente.
          </Text>
          <View style={styles.retryButton}>
            <Button label="Tentar novamente" onPress={load} />
          </View>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <ToastProvider>{children}</ToastProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f3f6fb",
    gap: 10,
  },
  errorTitle: {
    fontSize: 20,
    color: "#7f1d1d",
    fontWeight: "700",
    textAlign: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#374151",
    textAlign: "center",
  },
  retryButton: {
    width: "100%",
    maxWidth: 260,
    marginTop: 8,
  },
});
