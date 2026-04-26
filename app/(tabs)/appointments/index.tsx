import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { EmptyState } from "@/components/feedback/EmptyState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { appointmentsService } from "@/modules/appointments/appointments.service";
import {
  APPOINTMENT_STATUSES,
  Appointment,
  AppointmentStatus,
} from "@/modules/appointments/types/appointment.types";
import { FEEDBACK_MESSAGES } from "@/shared/constants/feedback-messages";
import { toISODate, toPtBrDateTime } from "@/shared/utils/date";
import {
  getErrorMessage,
  reportNonSensitiveError,
} from "@/shared/utils/error-message";

const statusLabel: Record<AppointmentStatus, string> = {
  agendado: "Agendado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

const statusColors: Record<AppointmentStatus, string> = {
  agendado: "#1f4db8",
  concluido: "#0f766e",
  cancelado: "#b91c1c",
};

export default function AppointmentsScreen() {
  const router = useRouter();
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(toISODate());
  const [endDate, setEndDate] = useState(
    toISODate(new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)),
  );
  const [status, setStatus] = useState<AppointmentStatus | undefined>();

  const loadAppointments = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await appointmentsService.list({
        startDate,
        endDate,
        status,
      });
      setItems(data);
    } catch (loadError) {
      reportNonSensitiveError("appointments.list.load", loadError);
      setError(getErrorMessage(loadError, FEEDBACK_MESSAGES.genericLoadError));
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAppointments();
    }, [startDate, endDate, status]),
  );

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Agendamentos</Text>

      <View style={styles.filters}>
        <Input
          label="De"
          placeholder="AAAA-MM-DD"
          value={startDate}
          onChangeText={setStartDate}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Input
          label="Até"
          placeholder="AAAA-MM-DD"
          value={endDate}
          onChangeText={setEndDate}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.statusRow}>
        <Pressable
          style={[
            styles.statusButton,
            !status ? styles.statusButtonActive : null,
          ]}
          onPress={() => setStatus(undefined)}
          hitSlop={6}
        >
          <Text
            style={[
              styles.statusButtonText,
              !status ? styles.statusButtonTextActive : null,
            ]}
          >
            Todos
          </Text>
        </Pressable>

        {APPOINTMENT_STATUSES.map((itemStatus) => (
          <Pressable
            key={itemStatus}
            style={[
              styles.statusButton,
              status === itemStatus ? styles.statusButtonActive : null,
            ]}
            onPress={() => setStatus(itemStatus)}
            hitSlop={6}
          >
            <Text
              style={[
                styles.statusButtonText,
                status === itemStatus ? styles.statusButtonTextActive : null,
              ]}
            >
              {statusLabel[itemStatus]}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={styles.addButton}
        onPress={() => router.push("/(tabs)/appointments/create")}
      >
        <Text style={styles.addLabel}>+ Novo agendamento</Text>
      </Pressable>

      {loading ? <LoadingState label="Buscando agendamentos..." /> : null}
      {error ? <EmptyState title="Erro" description={error} /> : null}

      {!loading && !error ? (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState
              title="Nenhum agendamento"
              description="Ajuste os filtros ou crie um novo agendamento."
            />
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/(tabs)/appointments/${item.id}`)}
            >
              <Card style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text
                    style={[styles.badge, { color: statusColors[item.status] }]}
                  >
                    {statusLabel[item.status]}
                  </Text>
                </View>
                <Text style={styles.meta}>{item.patient_name}</Text>
                <Text style={styles.meta}>
                  {toPtBrDateTime(item.start_date)}
                </Text>
              </Card>
            </Pressable>
          )}
        />
      ) : null}
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
  title: {
    fontSize: 24,
    color: "#0f172a",
    fontWeight: "800",
  },
  filters: {
    gap: 10,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statusButton: {
    minHeight: 40,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#ffffff",
    justifyContent: "center",
  },
  statusButtonActive: {
    borderColor: "#1f4db8",
    backgroundColor: "#dbe7ff",
  },
  statusButtonText: {
    color: "#334155",
    fontWeight: "600",
    fontSize: 12,
  },
  statusButtonTextActive: {
    color: "#1f4db8",
  },
  addButton: {
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: "#dbe7ff",
    alignItems: "center",
    justifyContent: "center",
  },
  addLabel: {
    fontSize: 14,
    color: "#1f4db8",
    fontWeight: "700",
  },
  listContent: {
    gap: 10,
    paddingBottom: 20,
  },
  card: {
    gap: 4,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    color: "#0f172a",
    fontWeight: "700",
    flex: 1,
  },
  meta: {
    fontSize: 13,
    color: "#475569",
  },
  badge: {
    fontSize: 12,
    fontWeight: "700",
  },
});
