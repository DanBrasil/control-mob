import { useCallback, useState } from "react";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { ConfirmDialog } from "@/components/feedback/ConfirmDialog";
import { EmptyState } from "@/components/feedback/EmptyState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { financialService } from "@/modules/financial/financial.service";
import { FinancialEntry, FinancialKind } from "@/modules/financial/types/financial.types";
import { useToast } from "@/shared/hooks/useToast";
import { toPtBrDateTime } from "@/shared/utils/date";

const kindLabel: Record<FinancialKind, string> = {
  entrada: "Entrada",
  saida: "Saída",
};

export default function FinancialDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const toast = useToast();
  const [item, setItem] = useState<FinancialEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const entryId = Number(id);

  const load = async () => {
    setLoading(true);
    const current = await financialService.getById(entryId);
    setItem(current);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [entryId]),
  );

  const handleDelete = async () => {
    await financialService.remove(entryId);
    setConfirmVisible(false);
    toast.show({ message: "Lançamento removido.", type: "success" });
    router.replace("/(tabs)/financial");
  };

  if (loading) {
    return <LoadingState label="Carregando lançamento..." />;
  }

  if (!item) {
    return (
      <EmptyState
        title="Lançamento não encontrado"
        description="Verifique se o registro ainda existe no banco local."
      />
    );
  }

  return (
    <View style={styles.screen}>
      <Card style={styles.card}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.label}>Tipo</Text>
        <Text style={styles.value}>{kindLabel[item.kind]}</Text>

        <Text style={styles.label}>Valor</Text>
        <Text style={styles.value}>R$ {item.amount.toFixed(2)}</Text>

        <Text style={styles.label}>Data</Text>
        <Text style={styles.value}>{toPtBrDateTime(item.entry_date)}</Text>

        <Text style={styles.label}>Observações</Text>
        <Text style={styles.value}>{item.notes || "Sem observações"}</Text>
      </Card>

      <Button
        label="Editar"
        variant="outline"
        onPress={() => router.push(`/(tabs)/financial/edit/${item.id}`)}
      />
      <Button label="Remover" variant="danger" onPress={() => setConfirmVisible(true)} />

      <ConfirmDialog
        visible={confirmVisible}
        title="Remover lançamento"
        message="Essa ação exclui o lançamento e não pode ser desfeita."
        confirmLabel="Remover"
        onConfirm={handleDelete}
        onCancel={() => setConfirmVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f3f6fb",
    padding: 16,
    gap: 12,
  },
  card: {
    gap: 6,
  },
  title: {
    fontSize: 20,
    color: "#0f172a",
    fontWeight: "700",
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: "#64748b",
    textTransform: "uppercase",
    fontWeight: "700",
  },
  value: {
    fontSize: 14,
    color: "#334155",
    marginBottom: 4,
  },
});
