import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import { SafeScreen } from "@/components/SafeScreen";
import { EmptyState } from "@/components/feedback/EmptyState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { PatientForm } from "@/modules/patients/components/PatientForm";
import { patientsService } from "@/modules/patients/patients.service";
import { PatientFormValues } from "@/modules/patients/schemas/patient.schema";
import { Patient } from "@/modules/patients/types/patient.types";
import { FEEDBACK_MESSAGES } from "@/shared/constants/feedback-messages";
import { useToast } from "@/shared/hooks/useToast";
import {
  getErrorMessage,
  reportNonSensitiveError,
} from "@/shared/utils/error-message";

export default function PatientEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string | null>(null);

  const patientId = Number(id);

  useEffect(() => {
    const load = async () => {
      setError(null);

      try {
        const current = await patientsService.getById(patientId);
        setPatient(current);
      } catch (loadError) {
        reportNonSensitiveError("patients.edit.load", loadError);
        setError(
          getErrorMessage(loadError, FEEDBACK_MESSAGES.genericLoadError),
        );
      }
    };

    load();
  }, [patientId]);

  const handleSubmit = async (values: PatientFormValues) => {
    try {
      await patientsService.update(patientId, values);
      toast.show({ message: "Paciente atualizado.", type: "success" });
      router.replace(`/(tabs)/patients/${patientId}`);
    } catch (saveError) {
      reportNonSensitiveError("patients.edit.save", saveError);
      toast.show({
        message: getErrorMessage(saveError, FEEDBACK_MESSAGES.genericSaveError),
        type: "error",
      });
    }
  };

  if (error) {
    return <EmptyState title="Erro" description={error} />;
  }

  if (!patient) {
    return <LoadingState label="Carregando paciente..." />;
  }

  return (
    <SafeScreen contentStyle={styles.content}>
      <PatientForm
        defaultValues={{
          name: patient.name,
          phone: patient.phone ?? "",
          notes: patient.notes ?? "",
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
