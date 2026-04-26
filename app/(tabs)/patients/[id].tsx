import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { ConfirmDialog } from "@/components/feedback/ConfirmDialog";
import { EmptyState } from "@/components/feedback/EmptyState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { patientsService } from "@/modules/patients/patients.service";
import { Patient } from "@/modules/patients/types/patient.types";
import { useToast } from "@/shared/hooks/useToast";

export default function PatientDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const toast = useToast();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const patientId = Number(id);

  const load = async () => {
    setLoading(true);
    const current = await patientsService.getById(patientId);
    setPatient(current);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [patientId]),
  );

  const handleDelete = async () => {
    await patientsService.remove(patientId);
    setConfirmVisible(false);
    toast.show({ message: "Paciente removido.", type: "success" });
    router.replace("/(tabs)/patients");
  };

  if (loading) {
    return <LoadingState label="Carregando detalhes..." />;
  }

  if (!patient) {
    return (
      <EmptyState
        title="Paciente não encontrado"
        description="Verifique o cadastro."
      />
    );
  }

  return (
    <View style={styles.screen}>
      <Card style={styles.card}>
        <Text style={styles.name}>{patient.name}</Text>
        <Text style={styles.label}>Telefone</Text>
        <Text style={styles.value}>{patient.phone || "Não informado"}</Text>
        <Text style={styles.label}>Observações</Text>
        <Text style={styles.value}>{patient.notes || "Sem observações"}</Text>
      </Card>

      <Button
        label="Editar"
        variant="outline"
        onPress={() => router.push(`/(tabs)/patients/edit/${patient.id}`)}
      />
      <Button
        label="Remover"
        variant="danger"
        onPress={() => setConfirmVisible(true)}
      />

      <ConfirmDialog
        visible={confirmVisible}
        title="Remover paciente"
        message="Essa ação exclui o paciente e não pode ser desfeita."
        confirmLabel="Remover"
        onConfirm={handleDelete}
        onCancel={() => setConfirmVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f3f6fb",
    padding: 16,
    gap: 12,
  },
  card: {
    gap: 6,
  },
  name: {
    fontSize: 20,
    color: "#0f172a",
    fontWeight: "700",
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: "#64748b",
    textTransform: "uppercase",
    fontWeight: "700",
  },
  value: {
    fontSize: 14,
    color: "#334155",
    marginBottom: 4,
  },
});
