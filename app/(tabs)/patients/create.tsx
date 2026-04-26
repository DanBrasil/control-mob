import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";

import { SafeScreen } from "@/components/SafeScreen";
import { PatientForm } from "@/modules/patients/components/PatientForm";
import { patientsService } from "@/modules/patients/patients.service";
import { PatientFormValues } from "@/modules/patients/schemas/patient.schema";
import { FEEDBACK_MESSAGES } from "@/shared/constants/feedback-messages";
import { useToast } from "@/shared/hooks/useToast";
import {
  getErrorMessage,
  reportNonSensitiveError,
} from "@/shared/utils/error-message";

export default function PatientCreateScreen() {
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (values: PatientFormValues) => {
    try {
      await patientsService.create(values);
      toast.show({ message: "Paciente salvo com sucesso.", type: "success" });
      router.replace("/(tabs)/patients");
    } catch (error) {
      reportNonSensitiveError("patients.create", error);
      toast.show({
        message: getErrorMessage(error, FEEDBACK_MESSAGES.genericSaveError),
        type: "error",
      });
    }
  };

  return (
    <SafeScreen contentStyle={styles.content}>
      <PatientForm onSubmit={handleSubmit} />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 10,
  },
});
