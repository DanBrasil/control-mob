import { useCallback, useState } from "react";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { ConfirmDialog } from "@/components/feedback/ConfirmDialog";
import { EmptyState } from "@/components/feedback/EmptyState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { appointmentsService } from "@/modules/appointments/appointments.service";
import {
  Appointment,
  AppointmentStatus,
} from "@/modules/appointments/types/appointment.types";
import { useToast } from "@/shared/hooks/useToast";
import { toPtBrDateTime } from "@/shared/utils/date";

const statusLabel: Record<AppointmentStatus, string> = {
  agendado: "Agendado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

export default function AppointmentDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const toast = useToast();
  const [item, setItem] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const appointmentId = Number(id);

  const load = async () => {
    setLoading(true);
    const current = await appointmentsService.getById(appointmentId);
    setItem(current);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [appointmentId]),
  );

  const handleDelete = async () => {
    await appointmentsService.remove(appointmentId);
    setConfirmVisible(false);
    toast.show({ message: "Agendamento removido.", type: "success" });
    router.replace("/(tabs)/appointments");
  };

  if (loading) {
    return <LoadingState label="Carregando agendamento..." />;
  }

  if (!item) {
    return (
      <EmptyState
        title="Agendamento não encontrado"
        description="Verifique se ele ainda existe no banco local."
      />
    );
  }

  return (
    <View style={styles.screen}>
      <Card style={styles.card}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.label}>Paciente</Text>
        <Text style={styles.value}>{item.patient_name}</Text>

        <Text style={styles.label}>Status</Text>
        <Text style={styles.value}>{statusLabel[item.status]}</Text>

        <Text style={styles.label}>Início</Text>
        <Text style={styles.value}>{toPtBrDateTime(item.start_date)}</Text>

        <Text style={styles.label}>Fim</Text>
        <Text style={styles.value}>
          {item.end_date ? toPtBrDateTime(item.end_date) : "Não definido"}
        </Text>

        <Text style={styles.label}>Observações</Text>
        <Text style={styles.value}>{item.notes || "Sem observações"}</Text>
      </Card>

      <Button
        label="Editar"
        variant="outline"
        onPress={() => router.push(`/(tabs)/appointments/edit/${item.id}`)}
      />
      <Button label="Remover" variant="danger" onPress={() => setConfirmVisible(true)} />

      <ConfirmDialog
        visible={confirmVisible}
        title="Remover agendamento"
        message="Essa ação exclui o agendamento e não pode ser desfeita."
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
  title: {
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
