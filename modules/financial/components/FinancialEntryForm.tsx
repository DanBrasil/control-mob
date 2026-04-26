import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { CalendarDatePicker } from "@/components/ui/CalendarDatePicker";
import { Input } from "@/components/ui/Input";
import {
  FinancialEntryFormValues,
  financialEntrySchema,
} from "@/modules/financial/schemas/financial.schema";
import {
  FINANCIAL_KINDS,
  FinancialKind,
} from "@/modules/financial/types/financial.types";
import { theme } from "@/shared/constants/theme";
import {
  formatDateForPtBrInput,
  formatDateTimeForPtBrInput,
  maskTimeInput,
  normalizeDateTimeInput,
} from "@/shared/utils/date";

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
  const initialEntry = useMemo(
    () => normalizeDateTimeInput(defaultValues?.entry_date ?? ""),
    [defaultValues?.entry_date],
  );

  const [selectedDate, setSelectedDate] = useState<string>(
    initialEntry?.split("T")[0] ?? new Date().toISOString().slice(0, 10),
  );
  const [entryTime, setEntryTime] = useState<string>(
    initialEntry?.split("T")[1] ?? "09:00",
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FinancialEntryFormValues>({
    resolver: zodResolver(financialEntrySchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      amount: defaultValues?.amount,
      kind: defaultValues?.kind ?? "entrada",
      entry_date:
        formatDateTimeForPtBrInput(defaultValues?.entry_date ?? "") ||
        `${formatDateForPtBrInput(selectedDate)} ${entryTime}`,
      notes: defaultValues?.notes ?? "",
    },
  });

  useEffect(() => {
    const entryDateTime = `${formatDateForPtBrInput(selectedDate)} ${entryTime}`;
    setValue("entry_date", entryDateTime, { shouldValidate: true });
  }, [selectedDate, entryTime, setValue]);

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

      <CalendarDatePicker
        label="Data do lançamento"
        value={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        error={errors.entry_date?.message}
      />

      <Input
        label="Horário"
        placeholder="HH:mm"
        value={entryTime}
        onChangeText={(value) => setEntryTime(maskTimeInput(value))}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="number-pad"
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
                    style={[
                      styles.kindItem,
                      selected ? styles.kindItemSelected : null,
                    ]}
                    onPress={() => field.onChange(kind)}
                    hitSlop={6}
                  >
                    <Text
                      style={[
                        styles.kindText,
                        selected ? styles.kindTextSelected : null,
                      ]}
                    >
                      {kindLabel[kind]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {errors.kind?.message ? (
              <Text style={styles.errorText}>{errors.kind.message}</Text>
            ) : null}
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
        onPress={handleSubmit((values) =>
          onSubmit({
            ...values,
            entry_date:
              normalizeDateTimeInput(values.entry_date) ?? values.entry_date,
          }),
        )}
        loading={loading || isSubmitting}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  kindRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  kindItem: {
    minHeight: 42,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    justifyContent: "center",
  },
  kindItemSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primarySoft,
  },
  kindText: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  kindTextSelected: {
    color: theme.colors.primary,
  },
  notesInput: {
    minHeight: 110,
    paddingTop: 12,
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.danger,
    fontWeight: "600",
  },
});
