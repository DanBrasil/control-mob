import { Text, View } from "react-native";

import { EmptyState } from "@/components/feedback/EmptyState";
import { Card } from "@/components/ui/Card";
import { AppointmentStatus } from "@/modules/appointments/types/appointment.types";
import { DashboardUpcomingAppointment } from "@/modules/dashboard/types/dashboard.types";
import {
  formatDashboardDate,
  formatDashboardTime,
} from "@/modules/dashboard/utils/dashboard-calculations";

import { styles } from "./UpcomingAppointments.styles";

type Props = {
  items: DashboardUpcomingAppointment[];
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

export function UpcomingAppointments({ items }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Próximos agendamentos</Text>

      {items.length === 0 ? (
        <EmptyState
          title="Sem próximos compromissos"
          description="Nenhum agendamento futuro encontrado."
        />
      ) : (
        <View style={styles.list}>
          {items.map((item) => (
            <Card key={item.id} style={styles.card}>
              <View style={styles.topRow}>
                <Text style={styles.patientName}>{item.patientName}</Text>
                <Text
                  style={[styles.status, { color: statusColor[item.status] }]}
                >
                  {statusLabel[item.status]}
                </Text>
              </View>

              <Text style={styles.meta}>
                Data: {formatDashboardDate(item.startDate)} às{" "}
                {formatDashboardTime(item.startDate)}
              </Text>
            </Card>
          ))}
        </View>
      )}
    </View>
  );
}
