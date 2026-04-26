import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { EmptyState } from "@/components/feedback/EmptyState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { AppointmentForm } from "@/modules/appointments/components/AppointmentForm";
import { AppointmentFormValues } from "@/modules/appointments/schemas/appointment.schema";
import { appointmentsService } from "@/modules/appointments/appointments.service";
import {
  Appointment,
  AppointmentPatientOption,
} from "@/modules/appointments/types/appointment.types";
import { patientsService } from "@/modules/patients/patients.service";
import { useToast } from "@/shared/hooks/useToast";
import { toDateTimeInputValue } from "@/shared/utils/date";

export default function AppointmentEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const [item, setItem] = useState<Appointment | null>(null);
  const [patients, setPatients] = useState<AppointmentPatientOption[]>([]);
  const [loading, setLoading] = useState(true);

  const appointmentId = Number(id);

  useEffect(() => {
    const load = async () => {
      const [appointment, allPatients] = await Promise.all([
        appointmentsService.getById(appointmentId),
        patientsService.list(),
      ]);

      setItem(appointment);
      setPatients(allPatients.map((patient) => ({ id: patient.id, name: patient.name })));
      setLoading(false);
    };

    load();
  }, [appointmentId]);

  const handleSubmit = async (values: AppointmentFormValues) => {
    await appointmentsService.update(appointmentId, values);
    toast.show({ message: "Agendamento atualizado.", type: "success" });
    router.replace(`/(tabs)/appointments/${appointmentId}`);
  };

  if (loading) {
    return <LoadingState label="Carregando agendamento..." />;
  }

  if (!item) {
    return (
      <View style={styles.screen}>
        <EmptyState
          title="Agendamento não encontrado"
          description="Não foi possível carregar o registro para edição."
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
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
