import { Text, View } from "react-native";

import { EmptyState } from "@/components/feedback/EmptyState";
import { Card } from "@/components/ui/Card";
import {
  APPOINTMENT_STATUSES,
  AppointmentStatus,
} from "@/modules/appointments/types/appointment.types";
import { DashboardTodayAppointment } from "@/modules/dashboard/types/dashboard.types";
import { formatDashboardTime } from "@/modules/dashboard/utils/dashboard-calculations";

import { styles } from "./TodayAppointments.styles";

type Props = {
  items: DashboardTodayAppointment[];
};

const statusLabel: Record<AppointmentStatus, string> = {
  agendado: "Agendado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

const statusColor: Record<AppointmentStatus, string> = {
  agendado: "#1f4db8",
  concluido: "#0f766e",
  cancelado: "#b91c1c",
};

const isStatusValid = (status: string): status is AppointmentStatus =>
  APPOINTMENT_STATUSES.includes(status as AppointmentStatus);

export function TodayAppointments({ items }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agendamentos de hoje</Text>

      {items.length === 0 ? (
        <EmptyState
          title="Dia sem agendamentos"
          description="Não há compromissos para hoje."
        />
      ) : (
        <View style={styles.list}>
          {items.map((item) => {
            const status = isStatusValid(item.status)
              ? item.status
              : "agendado";

            return (
              <Card key={item.id} style={styles.card}>
                <View style={styles.topRow}>
                  <Text style={styles.patientName}>{item.patientName}</Text>
                  <Text style={[styles.status, { color: statusColor[status] }]}>
                    {statusLabel[status]}
                  </Text>
                </View>

                <Text style={styles.meta}>
                  Horário: {formatDashboardTime(item.startDate)}
                </Text>

                {item.notesSummary ? (
                  <Text style={styles.notes}>
                    Observação: {item.notesSummary}
                  </Text>
                ) : null}
              </Card>
            );
          })}
        </View>
      )}
    </View>
  );
}
