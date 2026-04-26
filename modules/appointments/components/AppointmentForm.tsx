import Ionicons from "@expo/vector-icons/Ionicons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { CalendarDatePicker } from "@/components/ui/CalendarDatePicker";
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
import { theme } from "@/shared/constants/theme";
import {
  formatDateForPtBrInput,
  formatDateTimeForPtBrInput,
  maskTimeInput,
  normalizeDateTimeInput,
} from "@/shared/utils/date";

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
  submitLabel = "Confirmar agendamento",
  onSubmit,
}: Props) {
  const initialStart = useMemo(
    () => normalizeDateTimeInput(defaultValues?.start_date ?? ""),
    [defaultValues?.start_date],
  );
  const initialEnd = useMemo(
    () => normalizeDateTimeInput(defaultValues?.end_date ?? ""),
    [defaultValues?.end_date],
  );

  const [selectedDate, setSelectedDate] = useState<string>(
    initialStart?.split("T")[0] ?? new Date().toISOString().slice(0, 10),
  );
  const [startTime, setStartTime] = useState<string>(
    initialStart?.split("T")[1] ?? "09:00",
  );
  const [endTime, setEndTime] = useState<string>(
    initialEnd?.split("T")[1] ?? "",
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patient_id: defaultValues?.patient_id,
      title: defaultValues?.title ?? "",
      notes: defaultValues?.notes ?? "",
      start_date:
        formatDateTimeForPtBrInput(defaultValues?.start_date ?? "") ||
        `${formatDateForPtBrInput(selectedDate)} ${startTime}`,
      end_date: formatDateTimeForPtBrInput(defaultValues?.end_date ?? ""),
      status: defaultValues?.status ?? "agendado",
    },
  });

  useEffect(() => {
    const startDateTime = `${formatDateForPtBrInput(selectedDate)} ${startTime}`;
    setValue("start_date", startDateTime, { shouldValidate: true });

    if (endTime.trim()) {
      const endDateTime = `${formatDateForPtBrInput(selectedDate)} ${endTime}`;
      setValue("end_date", endDateTime, { shouldValidate: true });
      return;
    }

    setValue("end_date", "", { shouldValidate: true });
  }, [selectedDate, startTime, endTime, setValue]);

  return (
    <View style={styles.form}>
      <View style={styles.selectCard}>
        <Text style={styles.sectionTitle}>Detalhes</Text>

        <Controller
          control={control}
          name="patient_id"
          render={({ field }) => (
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Paciente</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsWrap}
              >
                {patients.map((patient) => {
                  const selected = field.value === patient.id;

                  return (
                    <Pressable
                      key={patient.id}
                      style={[
                        styles.selectChip,
                        selected ? styles.selectChipActive : null,
                      ]}
                      onPress={() => field.onChange(patient.id)}
                      hitSlop={6}
                    >
                      <Ionicons
                        name="person"
                        size={13}
                        color={
                          selected
                            ? theme.colors.primary
                            : theme.colors.textMuted
                        }
                      />
                      <Text
                        style={[
                          styles.selectChipText,
                          selected ? styles.selectChipTextActive : null,
                        ]}
                      >
                        {patient.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
              {errors.patient_id?.message ? (
                <Text style={styles.errorText}>
                  {errors.patient_id.message}
                </Text>
              ) : null}
            </View>
          )}
        />

        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <Input
              label="Modalidade / título"
              placeholder="Ex.: Sessão online"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.title?.message}
            />
          )}
        />

        <CalendarDatePicker
          label="Data"
          value={selectedDate}
          onChange={(date) => setSelectedDate(date)}
        />

        <View style={styles.sessionTimeRow}>
          <Input
            label="Início da sessão"
            placeholder="HH:mm"
            value={startTime}
            onChangeText={(value) => setStartTime(maskTimeInput(value))}
            keyboardType="number-pad"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.start_date?.message}
            style={styles.sessionTimeInput}
          />

          <Input
            label="Fim da sessão"
            placeholder="HH:mm"
            value={endTime}
            onChangeText={(value) => setEndTime(maskTimeInput(value))}
            keyboardType="number-pad"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.end_date?.message}
            style={styles.sessionTimeInput}
          />
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.sectionTitle}>Recorrência</Text>
        <View style={styles.recurrenceCard}>
          {(["Não", "Semanal", "Quinzenal", "Mensal"] as const).map(
            (option, index) => (
              <View
                key={option}
                style={[
                  styles.recurrenceOption,
                  index === 1 ? styles.recurrenceOptionActive : null,
                ]}
              >
                <Text
                  style={[
                    styles.recurrenceText,
                    index === 1 ? styles.recurrenceTextActive : null,
                  ]}
                >
                  {option}
                </Text>
              </View>
            ),
          )}
        </View>
      </View>

      <View style={styles.valueCard}>
        <Text style={styles.valueLabel}>Valor & cobrança</Text>
        <Text style={styles.valueAmount}>Sessão padrão R$ 280,00</Text>
        <View style={styles.valueChip}>
          <Ionicons
            name="qr-code-outline"
            size={12}
            color={theme.colors.success}
          />
          <Text style={styles.valueChipText}>Pix automático</Text>
        </View>
      </View>

      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <View style={styles.fieldGroup}>
            <Text style={styles.sectionTitle}>Status</Text>
            <View style={styles.statusRow}>
              {APPOINTMENT_STATUSES.map((status) => {
                const selected = field.value === status;

                return (
                  <Pressable
                    key={status}
                    style={[
                      styles.statusItem,
                      selected ? styles.statusItemSelected : null,
                    ]}
                    onPress={() => field.onChange(status)}
                    hitSlop={6}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        selected ? styles.statusTextSelected : null,
                      ]}
                    >
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
            placeholder="Detalhes do atendimento"
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
            start_date:
              normalizeDateTimeInput(values.start_date) ?? values.start_date,
            end_date: values.end_date
              ? (normalizeDateTimeInput(values.end_date) ?? values.end_date)
              : "",
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
  selectCard: {
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: 14,
    gap: 12,
  },
  fieldGroup: {
    gap: 6,
  },
  sectionTitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  label: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  chipsWrap: {
    gap: 8,
    paddingVertical: 4,
    paddingRight: 8,
  },
  sessionTimeRow: {
    flexDirection: "row",
    gap: 10,
  },
  sessionTimeInput: {
    flex: 1,
  },
  selectChip: {
    minHeight: 42,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: theme.colors.surface,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  selectChipActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primarySoft,
  },
  selectChipText: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  selectChipTextActive: {
    color: theme.colors.primary,
  },
  recurrenceCard: {
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: 8,
    flexDirection: "row",
    gap: 8,
  },
  recurrenceOption: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  recurrenceOptionActive: {
    backgroundColor: theme.colors.primary,
    ...theme.shadows.glowPrimary,
  },
  recurrenceText: {
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.textMuted,
  },
  recurrenceTextActive: {
    color: "#ffffff",
  },
  valueCard: {
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: 14,
    gap: 8,
  },
  valueLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: "600",
  },
  valueAmount: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.text,
    letterSpacing: -0.3,
  },
  valueChip: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.successSoft,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  valueChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.success,
  },
  statusRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  statusItem: {
    minHeight: 42,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#ffffff",
    justifyContent: "center",
  },
  statusItemSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primarySoft,
  },
  statusText: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  statusTextSelected: {
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
