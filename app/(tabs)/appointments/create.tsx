import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import { SafeScreen } from "@/components/SafeScreen";
import { EmptyState } from "@/components/feedback/EmptyState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { appointmentsService } from "@/modules/appointments/appointments.service";
import { AppointmentForm } from "@/modules/appointments/components/AppointmentForm";
import { AppointmentFormValues } from "@/modules/appointments/schemas/appointment.schema";
import { AppointmentPatientOption } from "@/modules/appointments/types/appointment.types";
import { patientsService } from "@/modules/patients/patients.service";
import { FEEDBACK_MESSAGES } from "@/shared/constants/feedback-messages";
import { useToast } from "@/shared/hooks/useToast";
import {
  getErrorMessage,
  reportNonSensitiveError,
} from "@/shared/utils/error-message";

export default function AppointmentCreateScreen() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<AppointmentPatientOption[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setError(null);

      try {
        const data = await patientsService.list();
        setPatients(
          data.map((patient) => ({ id: patient.id, name: patient.name })),
        );
      } catch (loadError) {
        reportNonSensitiveError("appointments.create.load-patients", loadError);
        setError(
          getErrorMessage(loadError, FEEDBACK_MESSAGES.genericLoadError),
        );
      }

      setLoading(false);
    };

    load();
  }, []);

  const handleSubmit = async (values: AppointmentFormValues) => {
    try {
      await appointmentsService.create(values);
      toast.show({
        message: "Agendamento salvo com sucesso.",
        type: "success",
      });
      router.replace("/(tabs)/appointments");
    } catch (saveError) {
      reportNonSensitiveError("appointments.create.save", saveError);
      toast.show({
        message: getErrorMessage(saveError, FEEDBACK_MESSAGES.genericSaveError),
        type: "error",
      });
    }
  };

  if (loading) {
    return <LoadingState label="Carregando pacientes..." />;
  }

  if (!patients.length) {
    return (
      <SafeScreen contentStyle={styles.content}>
        <EmptyState
          title={error ? "Erro" : "Cadastre pacientes antes"}
          description={
            error ??
            "É necessário ter ao menos um paciente para criar agendamentos."
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
          patient_id: patients[0]?.id,
          status: "agendado",
          start_date: new Date().toISOString().slice(0, 16),
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
