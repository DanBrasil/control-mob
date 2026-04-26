import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { FinancialEntryForm } from "@/modules/financial/components/FinancialEntryForm";
import { FinancialEntryFormValues } from "@/modules/financial/schemas/financial.schema";
import { financialService } from "@/modules/financial/financial.service";
import { useToast } from "@/shared/hooks/useToast";

export default function FinancialCreateScreen() {
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (values: FinancialEntryFormValues) => {
    await financialService.create(values);
    toast.show({ message: "Lançamento salvo com sucesso.", type: "success" });
    router.replace("/(tabs)/financial");
  };

  return (
    <View style={styles.screen}>
      <FinancialEntryForm
        defaultValues={{
          kind: "entrada",
          entry_date: new Date().toISOString().slice(0, 16),
        }}
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
