import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { PatientForm } from "@/modules/patients/components/PatientForm";
import { patientsService } from "@/modules/patients/patients.service";
import { PatientFormValues } from "@/modules/patients/schemas/patient.schema";
import { useToast } from "@/shared/hooks/useToast";

export default function PatientCreateScreen() {
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (values: PatientFormValues) => {
    await patientsService.create(values);
    toast.show({ message: "Paciente salvo com sucesso.", type: "success" });
    router.replace("/(tabs)/patients");
  };

  return (
    <View style={styles.screen}>
      <PatientForm onSubmit={handleSubmit} />
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
