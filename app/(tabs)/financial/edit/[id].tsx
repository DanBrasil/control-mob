import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import { SafeScreen } from "@/components/SafeScreen";
import { EmptyState } from "@/components/feedback/EmptyState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { FinancialEntryForm } from "@/modules/financial/components/FinancialEntryForm";
import { financialService } from "@/modules/financial/financial.service";
import { FinancialEntryFormValues } from "@/modules/financial/schemas/financial.schema";
import { FinancialEntry } from "@/modules/financial/types/financial.types";
import { FEEDBACK_MESSAGES } from "@/shared/constants/feedback-messages";
import { useToast } from "@/shared/hooks/useToast";
import { toDateTimeInputValue } from "@/shared/utils/date";
import {
  getErrorMessage,
  reportNonSensitiveError,
} from "@/shared/utils/error-message";

export default function FinancialEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const [item, setItem] = useState<FinancialEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const entryId = Number(id);

  useEffect(() => {
    const load = async () => {
      setError(null);

      try {
        const current = await financialService.getById(entryId);
        setItem(current);
      } catch (loadError) {
        reportNonSensitiveError("financial.edit.load", loadError);
        setError(
          getErrorMessage(loadError, FEEDBACK_MESSAGES.genericLoadError),
        );
      }

      setLoading(false);
    };

    load();
  }, [entryId]);

  const handleSubmit = async (values: FinancialEntryFormValues) => {
    try {
      await financialService.update(entryId, values);
      toast.show({ message: "Lançamento atualizado.", type: "success" });
      router.replace(`/(tabs)/financial/${entryId}`);
    } catch (saveError) {
      reportNonSensitiveError("financial.edit.save", saveError);
      toast.show({
        message: getErrorMessage(saveError, FEEDBACK_MESSAGES.genericSaveError),
        type: "error",
      });
    }
  };

  if (loading) {
    return <LoadingState label="Carregando lançamento..." />;
  }

  if (!item) {
    return (
      <SafeScreen contentStyle={styles.content}>
        <EmptyState
          title={error ? "Erro" : "Lançamento não encontrado"}
          description={
            error ?? "Não foi possível carregar esse registro para edição."
          }
        />
      </SafeScreen>
    );
  }

  return (
    <SafeScreen contentStyle={styles.content}>
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
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 10,
  },
});
