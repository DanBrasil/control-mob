import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  FinancialEntryFormValues,
  financialEntrySchema,
} from "@/modules/financial/schemas/financial.schema";
import {
  FINANCIAL_KINDS,
  FinancialKind,
} from "@/modules/financial/types/financial.types";

type Props = {
  defaultValues?: Partial<FinancialEntryFormValues>;
  loading?: boolean;
  submitLabel?: string;
  onSubmit: (values: FinancialEntryFormValues) => Promise<void>;
};

const kindLabel: Record<FinancialKind, string> = {
  entrada: "Entrada",
  saida: "Saída",
};

export function FinancialEntryForm({
  defaultValues,
  loading = false,
  submitLabel = "Salvar lançamento",
  onSubmit,
}: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FinancialEntryFormValues>({
    resolver: zodResolver(financialEntrySchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      amount: defaultValues?.amount,
      kind: defaultValues?.kind ?? "entrada",
      entry_date: defaultValues?.entry_date ?? "",
      notes: defaultValues?.notes ?? "",
    },
  });

  return (
    <View style={styles.form}>
      <Controller
        control={control}
        name="title"
        render={({ field }) => (
          <Input
            label="Título"
            placeholder="Ex.: Consulta particular"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.title?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="amount"
        render={({ field }) => (
          <Input
            label="Valor"
            placeholder="Ex.: 150.00"
            value={field.value ? String(field.value) : ""}
            onChangeText={(value) => {
              const normalized = value.replace(",", ".");
              const parsed = Number(normalized);
              field.onChange(Number.isNaN(parsed) ? undefined : parsed);
            }}
            onBlur={field.onBlur}
            keyboardType="decimal-pad"
            error={errors.amount?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="entry_date"
        render={({ field }) => (
          <Input
            label="Data do lançamento"
            placeholder="AAAA-MM-DDTHH:mm"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.entry_date?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="kind"
        render={({ field }) => (
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Tipo</Text>
            <View style={styles.kindRow}>
              {FINANCIAL_KINDS.map((kind) => {
                const selected = field.value === kind;

                return (
                  <Pressable
                    key={kind}
                    style={[styles.kindItem, selected ? styles.kindItemSelected : null]}
                    onPress={() => field.onChange(kind)}>
                    <Text style={[styles.kindText, selected ? styles.kindTextSelected : null]}>
                      {kindLabel[kind]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {errors.kind?.message ? <Text style={styles.errorText}>{errors.kind.message}</Text> : null}
          </View>
        )}
      />

      <Controller
        control={control}
        name="notes"
        render={({ field }) => (
          <Input
            label="Observações"
            placeholder="Detalhes do lançamento"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={styles.notesInput}
            error={errors.notes?.message}
          />
        )}
      />

      <Button
        label={submitLabel}
        onPress={handleSubmit((values) => onSubmit(values))}
        loading={loading || isSubmitting}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 14,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    color: "#475569",
    fontWeight: "600",
  },
  kindRow: {
    flexDirection: "row",
    gap: 8,
  },
  kindItem: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
  },
  kindItemSelected: {
    borderColor: "#1f4db8",
    backgroundColor: "#dbe7ff",
  },
  kindText: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "600",
  },
  kindTextSelected: {
    color: "#1f4db8",
  },
  notesInput: {
    minHeight: 96,
    paddingTop: 10,
  },
  errorText: {
    fontSize: 12,
    color: "#dc2626",
    fontWeight: "500",
  },
});
