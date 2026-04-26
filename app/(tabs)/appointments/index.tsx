import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { EmptyState } from "@/components/feedback/EmptyState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { CalendarDatePicker } from "@/components/ui/CalendarDatePicker";
import { Card } from "@/components/ui/Card";
import { appointmentsService } from "@/modules/appointments/appointments.service";
import {
  APPOINTMENT_STATUSES,
  Appointment,
  AppointmentStatus,
} from "@/modules/appointments/types/appointment.types";
import { FEEDBACK_MESSAGES } from "@/shared/constants/feedback-messages";
import { theme } from "@/shared/constants/theme";
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
  const initialStartDate = toISODate();
  const initialEndDate = toISODate(
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  );
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
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
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Agenda</Text>
          <Text style={styles.subtitle}>ABRIL · 2026</Text>
        </View>

        <View style={styles.headerActions}>
          <Pressable style={styles.iconButton}>
            <Ionicons name="search" size={18} color={theme.colors.textMuted} />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <Ionicons name="filter" size={18} color={theme.colors.textMuted} />
          </Pressable>
        </View>
      </View>

      <View style={styles.filters}>
        <CalendarDatePicker
          label="De"
          value={startDate}
          onChange={(date) => setStartDate(date)}
        />

        <CalendarDatePicker
          label="Até"
          value={endDate}
          onChange={(date) => setEndDate(date)}
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
        <Ionicons name="add" size={16} color="#ffffff" />
        <Text style={styles.addLabel}>Novo agendamento</Text>
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
                  <Text style={styles.cardTime}>
                    {toPtBrDateTime(item.start_date)}
                  </Text>
                  <Text
                    style={[styles.badge, { color: statusColors[item.status] }]}
                  >
                    {statusLabel[item.status]}
                  </Text>
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.meta}>{item.patient_name}</Text>
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
    backgroundColor: theme.colors.background,
    padding: 16,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: theme.typography.h1.size,
    color: theme.colors.text,
    fontWeight: theme.typography.h1.weight,
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: "700",
    letterSpacing: 1,
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
    minHeight: 42,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#ffffff",
    justifyContent: "center",
  },
  statusButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primarySoft,
  },
  statusButtonText: {
    color: theme.colors.textMuted,
    fontWeight: "600",
    fontSize: 12,
  },
  statusButtonTextActive: {
    color: theme.colors.primary,
  },
  addButton: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    ...theme.shadows.glowPrimary,
  },
  addLabel: {
    fontSize: 15,
    color: "#ffffff",
    fontWeight: "800",
  },
  listContent: {
    gap: 10,
    paddingBottom: 140,
  },
  card: {
    gap: 6,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
  },
  cardTime: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: "700",
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: "800",
  },
  meta: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: "600",
  },
  badge: {
    fontSize: 12,
    fontWeight: "700",
  },
});
