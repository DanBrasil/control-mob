import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  AppointmentFormValues,
  appointmentSchema,
} from "@/modules/appointments/schemas/appointment.schema";
import {
  APPOINTMENT_STATUSES,
  AppointmentPatientOption,
  AppointmentStatus,
} from "@/modules/appointments/types/appointment.types";

type Props = {
  patients: AppointmentPatientOption[];
  defaultValues?: Partial<AppointmentFormValues>;
  loading?: boolean;
  submitLabel?: string;
  onSubmit: (values: AppointmentFormValues) => Promise<void>;
};

const statusLabel: Record<AppointmentStatus, string> = {
  agendado: "Agendado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

export function AppointmentForm({
  patients,
  defaultValues,
  loading = false,
  submitLabel = "Salvar agendamento",
  onSubmit,
}: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patient_id: defaultValues?.patient_id,
      title: defaultValues?.title ?? "",
      notes: defaultValues?.notes ?? "",
      start_date: defaultValues?.start_date ?? "",
      end_date: defaultValues?.end_date ?? "",
      status: defaultValues?.status ?? "agendado",
    },
  });

  return (
    <View style={styles.form}>
      <Controller
        control={control}
        name="patient_id"
        render={({ field }) => (
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Paciente</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsWrap}>
              {patients.map((patient) => {
                const selected = field.value === patient.id;

                return (
                  <Pressable
                    key={patient.id}
                    style={[styles.chip, selected ? styles.chipSelected : null]}
                    onPress={() => field.onChange(patient.id)}>
                    <Text style={[styles.chipText, selected ? styles.chipTextSelected : null]}>
                      {patient.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            {errors.patient_id?.message ? (
              <Text style={styles.errorText}>{errors.patient_id.message}</Text>
            ) : null}
          </View>
        )}
      />

      <Controller
        control={control}
        name="title"
        render={({ field }) => (
          <Input
            label="Título"
            placeholder="Ex.: Retorno pós-consulta"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.title?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="start_date"
        render={({ field }) => (
          <Input
            label="Início"
            placeholder="AAAA-MM-DDTHH:mm"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.start_date?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="end_date"
        render={({ field }) => (
          <Input
            label="Fim (opcional)"
            placeholder="AAAA-MM-DDTHH:mm"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.end_date?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusRow}>
              {APPOINTMENT_STATUSES.map((status) => {
                const selected = field.value === status;

                return (
                  <Pressable
                    key={status}
                    style={[styles.statusItem, selected ? styles.statusItemSelected : null]}
                    onPress={() => field.onChange(status)}>
                    <Text style={[styles.statusText, selected ? styles.statusTextSelected : null]}>
                      {statusLabel[status]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {errors.status?.message ? (
              <Text style={styles.errorText}>{errors.status.message}</Text>
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
            placeholder="Detalhes adicionais"
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
  chipsWrap: {
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#ffffff",
  },
  chipSelected: {
    borderColor: "#1f4db8",
    backgroundColor: "#dbe7ff",
  },
  chipText: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "600",
  },
  chipTextSelected: {
    color: "#1f4db8",
  },
  statusRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  statusItem: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#ffffff",
  },
  statusItemSelected: {
    borderColor: "#1f4db8",
    backgroundColor: "#dbe7ff",
  },
  statusText: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "600",
  },
  statusTextSelected: {
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
