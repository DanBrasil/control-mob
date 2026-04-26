import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";

import { SafeScreen } from "@/components/SafeScreen";
import { FinancialEntryForm } from "@/modules/financial/components/FinancialEntryForm";
import { financialService } from "@/modules/financial/financial.service";
import { FinancialEntryFormValues } from "@/modules/financial/schemas/financial.schema";
import { FEEDBACK_MESSAGES } from "@/shared/constants/feedback-messages";
import { useToast } from "@/shared/hooks/useToast";
import {
  getErrorMessage,
  reportNonSensitiveError,
} from "@/shared/utils/error-message";

export default function FinancialCreateScreen() {
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (values: FinancialEntryFormValues) => {
    try {
      await financialService.create(values);
      toast.show({ message: "Lançamento salvo com sucesso.", type: "success" });
      router.replace("/(tabs)/financial");
    } catch (saveError) {
      reportNonSensitiveError("financial.create", saveError);
      toast.show({
        message: getErrorMessage(saveError, FEEDBACK_MESSAGES.genericSaveError),
        type: "error",
      });
    }
  };

  return (
    <SafeScreen contentStyle={styles.content}>
      <FinancialEntryForm
        defaultValues={{
          kind: "entrada",
          entry_date: new Date().toISOString().slice(0, 16),
        }}
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
