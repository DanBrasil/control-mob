import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { LoadingState } from "@/components/feedback/LoadingState";
import { PatientForm } from "@/modules/patients/components/PatientForm";
import { patientsService } from "@/modules/patients/patients.service";
import { PatientFormValues } from "@/modules/patients/schemas/patient.schema";
import { Patient } from "@/modules/patients/types/patient.types";
import { useToast } from "@/shared/hooks/useToast";

export default function PatientEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const [patient, setPatient] = useState<Patient | null>(null);

  const patientId = Number(id);

  useEffect(() => {
    const load = async () => {
      const current = await patientsService.getById(patientId);
      setPatient(current);
    };

    load();
  }, [patientId]);

  const handleSubmit = async (values: PatientFormValues) => {
    await patientsService.update(patientId, values);
    toast.show({ message: "Paciente atualizado.", type: "success" });
    router.replace(`/(tabs)/patients/${patientId}`);
  };

  if (!patient) {
    return <LoadingState label="Carregando paciente..." />;
  }

  return (
    <View style={styles.screen}>
      <PatientForm
        defaultValues={{
          name: patient.name,
          phone: patient.phone ?? "",
          notes: patient.notes ?? "",
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
