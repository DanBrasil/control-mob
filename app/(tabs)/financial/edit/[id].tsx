import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { EmptyState } from "@/components/feedback/EmptyState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { FinancialEntryForm } from "@/modules/financial/components/FinancialEntryForm";
import { FinancialEntryFormValues } from "@/modules/financial/schemas/financial.schema";
import { financialService } from "@/modules/financial/financial.service";
import { FinancialEntry } from "@/modules/financial/types/financial.types";
import { useToast } from "@/shared/hooks/useToast";
import { toDateTimeInputValue } from "@/shared/utils/date";

export default function FinancialEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const [item, setItem] = useState<FinancialEntry | null>(null);
  const [loading, setLoading] = useState(true);

  const entryId = Number(id);

  useEffect(() => {
    const load = async () => {
      const current = await financialService.getById(entryId);
      setItem(current);
      setLoading(false);
    };

    load();
  }, [entryId]);

  const handleSubmit = async (values: FinancialEntryFormValues) => {
    await financialService.update(entryId, values);
    toast.show({ message: "Lançamento atualizado.", type: "success" });
    router.replace(`/(tabs)/financial/${entryId}`);
  };

  if (loading) {
    return <LoadingState label="Carregando lançamento..." />;
  }

  if (!item) {
    return (
      <View style={styles.screen}>
        <EmptyState
          title="Lançamento não encontrado"
          description="Não foi possível carregar esse registro para edição."
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FinancialEntryForm
        defaultValues={{
          title: item.title,
          amount: item.amount,
          kind: item.kind,
          entry_date: toDateTimeInputValue(item.entry_date),
          notes: item.notes ?? "",
        }}
        submitLabel="Salvar alterações"
        onSubmit={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f3f6fb",
    padding: 16,
  },
});
