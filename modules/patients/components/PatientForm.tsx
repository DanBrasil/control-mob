import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  PatientFormValues,
  patientSchema,
} from "@/modules/patients/schemas/patient.schema";

type Props = {
  defaultValues?: Partial<PatientFormValues>;
  submitLabel?: string;
  loading?: boolean;
  onSubmit: (values: PatientFormValues) => Promise<void>;
};

export function PatientForm({
  defaultValues,
  submitLabel = "Salvar paciente",
  loading = false,
  onSubmit,
}: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      phone: defaultValues?.phone ?? "",
      notes: defaultValues?.notes ?? "",
    },
  });

  return (
    <View style={styles.form}>
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <Input
            label="Nome"
            placeholder="Ex.: Maria da Silva"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.name?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="phone"
        render={({ field }) => (
          <Input
            label="Telefone"
            placeholder="(11) 99999-0000"
            keyboardType="phone-pad"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.phone?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="notes"
        render={({ field }) => (
          <Input
            label="Observações"
            placeholder="Notas importantes"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.notes?.message}
            style={styles.notesInput}
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
  notesInput: {
    minHeight: 96,
    paddingTop: 10,
  },
});
