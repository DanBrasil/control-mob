import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import { SafeScreen } from "@/components/SafeScreen";
import { EmptyState } from "@/components/feedback/EmptyState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { appointmentsService } from "@/modules/appointments/appointments.service";
import { AppointmentForm } from "@/modules/appointments/components/AppointmentForm";
import { AppointmentFormValues } from "@/modules/appointments/schemas/appointment.schema";
import {
  Appointment,
  AppointmentPatientOption,
} from "@/modules/appointments/types/appointment.types";
import { patientsService } from "@/modules/patients/patients.service";
import { FEEDBACK_MESSAGES } from "@/shared/constants/feedback-messages";
import { useToast } from "@/shared/hooks/useToast";
import { toDateTimeInputValue } from "@/shared/utils/date";
import {
  getErrorMessage,
  reportNonSensitiveError,
} from "@/shared/utils/error-message";

export default function AppointmentEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const [item, setItem] = useState<Appointment | null>(null);
  const [patients, setPatients] = useState<AppointmentPatientOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const appointmentId = Number(id);

  useEffect(() => {
    const load = async () => {
      setError(null);

      try {
        const [appointment, allPatients] = await Promise.all([
          appointmentsService.getById(appointmentId),
          patientsService.list(),
        ]);

        setItem(appointment);
        setPatients(
          allPatients.map((patient) => ({
            id: patient.id,
            name: patient.name,
          })),
        );
      } catch (loadError) {
        reportNonSensitiveError("appointments.edit.load", loadError);
        setError(
          getErrorMessage(loadError, FEEDBACK_MESSAGES.genericLoadError),
        );
      }

      setLoading(false);
    };

    load();
  }, [appointmentId]);

  const handleSubmit = async (values: AppointmentFormValues) => {
    try {
      await appointmentsService.update(appointmentId, values);
      toast.show({ message: "Agendamento atualizado.", type: "success" });
      router.replace(`/(tabs)/appointments/${appointmentId}`);
    } catch (saveError) {
      reportNonSensitiveError("appointments.edit.save", saveError);
      toast.show({
        message: getErrorMessage(saveError, FEEDBACK_MESSAGES.genericSaveError),
        type: "error",
      });
    }
  };

  if (loading) {
    return <LoadingState label="Carregando agendamento..." />;
  }

  if (!item) {
    return (
      <SafeScreen contentStyle={styles.content}>
        <EmptyState
          title={error ? "Erro" : "Agendamento não encontrado"}
          description={
            error ?? "Não foi possível carregar o registro para edição."
          }
        />
      </SafeScreen>
    );
  }

  return (
    <SafeScreen contentStyle={styles.content}>
      <AppointmentForm
        patients={patients}
        defaultValues={{
          patient_id: item.patient_id,
          title: item.title,
          notes: item.notes ?? "",
          start_date: toDateTimeInputValue(item.start_date),
          end_date: item.end_date ? toDateTimeInputValue(item.end_date) : "",
          status: item.status,
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
