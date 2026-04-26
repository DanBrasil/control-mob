import { Text, View } from "react-native";

import { Card } from "@/components/ui/Card";
import { DashboardAlert } from "@/modules/dashboard/types/dashboard.types";
import {
  formatDashboardDate,
  formatDashboardTime,
} from "@/modules/dashboard/utils/dashboard-calculations";

import { styles } from "./DashboardAlerts.styles";

type Props = {
  alerts: DashboardAlert[];
};

const alertLabel: Record<DashboardAlert["type"], string> = {
  cancelado: "Cancelamento",
  atrasado: "Atenção",
};

const alertColor: Record<DashboardAlert["type"], string> = {
  cancelado: "#b91c1c",
  atrasado: "#b45309",
};

export function DashboardAlerts({ alerts }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pendências e atenção</Text>

      {alerts.length === 0 ? (
        <Card style={styles.successCard}>
          <Text style={styles.successTitle}>Tudo em ordem</Text>
          <Text style={styles.successDescription}>
            Nenhuma pendência relevante encontrada no momento.
          </Text>
        </Card>
      ) : (
        <View style={styles.list}>
          {alerts.map((alert) => (
            <Card key={alert.id} style={styles.card}>
              <View style={styles.topRow}>
                <Text style={styles.patientName}>{alert.patientName}</Text>
                <Text
                  style={[styles.typeBadge, { color: alertColor[alert.type] }]}
                >
                  {alertLabel[alert.type]}
                </Text>
              </View>
              <Text style={styles.description}>{alert.description}</Text>
              <Text style={styles.meta}>
                {formatDashboardDate(alert.startDate)} às{" "}
                {formatDashboardTime(alert.startDate)}
              </Text>
            </Card>
          ))}
        </View>
      )}
    </View>
  );
}
