import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { EmptyState } from "@/components/feedback/EmptyState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { AppointmentForm } from "@/modules/appointments/components/AppointmentForm";
import { AppointmentFormValues } from "@/modules/appointments/schemas/appointment.schema";
import { appointmentsService } from "@/modules/appointments/appointments.service";
import { AppointmentPatientOption } from "@/modules/appointments/types/appointment.types";
import { patientsService } from "@/modules/patients/patients.service";
import { useToast } from "@/shared/hooks/useToast";

export default function AppointmentCreateScreen() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<AppointmentPatientOption[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await patientsService.list();
      setPatients(data.map((patient) => ({ id: patient.id, name: patient.name })));
      setLoading(false);
    };

    load();
  }, []);

  const handleSubmit = async (values: AppointmentFormValues) => {
    await appointmentsService.create(values);
    toast.show({ message: "Agendamento salvo com sucesso.", type: "success" });
    router.replace("/(tabs)/appointments");
  };

  if (loading) {
    return <LoadingState label="Carregando pacientes..." />;
  }

  if (!patients.length) {
    return (
      <View style={styles.screen}>
        <EmptyState
          title="Cadastre pacientes antes"
          description="É necessário ter ao menos um paciente para criar agendamentos."
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <AppointmentForm
        patients={patients}
        defaultValues={{
          patient_id: patients[0]?.id,
          status: "agendado",
          start_date: new Date().toISOString().slice(0, 16),
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
