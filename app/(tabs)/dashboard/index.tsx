import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { LoadingState } from "@/components/feedback/LoadingState";
import { Card } from "@/components/ui/Card";
import {
  DashboardMetrics,
  dashboardService,
} from "@/modules/dashboard/dashboard.service";

const initialState: DashboardMetrics = {
  appointmentsToday: 0,
  pendingAppointments: 0,
  balance: 0,
};

export default function DashboardScreen() {
  const [metrics, setMetrics] = useState(initialState);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        setLoading(true);
        const data = await dashboardService.getMetrics();
        setMetrics(data);
        setLoading(false);
      };

      load();
    }, []),
  );

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Resumo de hoje</Text>

      {loading ? <LoadingState /> : null}

      <View style={styles.grid}>
        <Card style={styles.metricCard}>
          <Text style={styles.metricLabel}>Agendamentos do dia</Text>
          <Text style={styles.metricValue}>{metrics.appointmentsToday}</Text>
        </Card>

        <Card style={styles.metricCard}>
          <Text style={styles.metricLabel}>Pendências</Text>
          <Text style={styles.metricValue}>{metrics.pendingAppointments}</Text>
        </Card>

        <Card style={styles.metricCard}>
          <Text style={styles.metricLabel}>Saldo atual</Text>
          <Text style={styles.metricValue}>
            R$ {metrics.balance.toFixed(2)}
          </Text>
        </Card>
      </View>
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
  grid: {
    gap: 10,
  },
  metricCard: {
    gap: 6,
  },
  metricLabel: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "600",
  },
  metricValue: {
    fontSize: 26,
    color: "#1f4db8",
    fontWeight: "800",
  },
});
