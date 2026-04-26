import Ionicons from "@expo/vector-icons/Ionicons";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { EmptyState } from "@/components/feedback/EmptyState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { Button } from "@/components/ui/Button";
import { useDashboard } from "@/modules/dashboard/hooks/useDashboard";
import {
  formatDashboardDate,
  formatDashboardTime,
} from "@/modules/dashboard/utils/dashboard-calculations";
import { theme } from "@/shared/constants/theme";

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const formatMoney = (value: number): string => moneyFormatter.format(value);

export function DashboardScreen() {
  const { data, loading, error, reload } = useDashboard();

  if (loading) {
    return (
      <View style={styles.loadingWrapper}>
        <LoadingState label="Carregando dashboard..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorWrapper}>
        <EmptyState title="Erro no dashboard" description={error} />
        <Button label="Tentar novamente" onPress={reload} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Nathaly Bruza</Text>
      <Text style={styles.generatedAt}>
        Atualizado em {formatDashboardDate(data.generatedAt).toUpperCase()} ·{" "}
        {formatDashboardTime(data.generatedAt)}
      </Text>

      <View style={styles.heroCard}>
        <Text style={styles.heroKicker}>Bom trabalho hoje</Text>
        <Text style={styles.heroTitle}>
          {data.summary.appointmentsToday} sessões em destaque
        </Text>
        <Text style={styles.heroDescription}>
          Você tem {data.upcomingAppointments.length} próximos atendimentos e
          saldo parcial de {formatMoney(data.summary.monthBalance)} no mês.
        </Text>
      </View>

      <View style={styles.summaryGrid}>
        <StatTile
          label="Pacientes"
          value={String(data.summary.totalPatients)}
          icon="people"
        />
        <StatTile
          label="Hoje"
          value={String(data.summary.appointmentsToday)}
          icon="calendar"
        />
        <StatTile
          label="Concluídos"
          value={String(data.summary.appointmentsCompletedMonth)}
          icon="checkmark-done"
        />
        <StatTile
          label="Saldo"
          value={formatMoney(data.summary.monthBalance)}
          icon="wallet"
          color={
            data.summary.monthBalance >= 0
              ? theme.colors.primary
              : theme.colors.danger
          }
        />
      </View>

      <Text style={styles.sectionTitle}>Hoje</Text>
      {data.todayAppointments.length === 0 ? (
        <EmptyState
          title="Dia sem agendamentos"
          description="Não há compromissos para hoje."
        />
      ) : (
        data.todayAppointments.slice(0, 3).map((item) => (
          <View key={item.id} style={styles.rowCard}>
            <View style={styles.rowTop}>
              <Text style={styles.rowTitle}>{item.patientName}</Text>
              <Text style={styles.rowBadge}>
                {formatDashboardTime(item.startDate)}
              </Text>
            </View>
            <Text style={styles.rowMeta}>
              {item.notesSummary || "Sem observações"}
            </Text>
          </View>
        ))
      )}

      <Text style={styles.sectionTitle}>Alertas</Text>
      {data.alerts.length === 0 ? (
        <EmptyState
          title="Tudo em ordem"
          description="Nenhuma pendência relevante encontrada no momento."
        />
      ) : (
        data.alerts.slice(0, 2).map((alert) => (
          <View key={alert.id} style={styles.alertCard}>
            <Ionicons
              name={alert.type === "cancelado" ? "alert-circle" : "warning"}
              size={18}
              color={
                alert.type === "cancelado"
                  ? theme.colors.danger
                  : theme.colors.warning
              }
            />
            <View style={styles.alertBody}>
              <Text style={styles.alertTitle}>{alert.patientName}</Text>
              <Text style={styles.alertMeta}>{alert.description}</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

type StatTileProps = {
  label: string;
  value: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  color?: string;
};

function StatTile({
  label,
  value,
  icon,
  color = theme.colors.primary,
}: StatTileProps) {
  return (
    <View style={styles.statTile}>
      <View
        style={[styles.statIcon, { backgroundColor: theme.colors.primarySoft }]}
      >
        <Ionicons name={icon} size={16} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 140,
    gap: 12,
  },
  title: {
    fontSize: 28,
    color: theme.colors.text,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  generatedAt: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: "700",
  },
  heroCard: {
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.primary,
    padding: 18,
    ...theme.shadows.glowPrimary,
  },
  heroKicker: {
    fontSize: 12,
    color: "#ffffff",
    opacity: 0.88,
    fontWeight: "700",
  },
  heroTitle: {
    marginTop: 4,
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  heroDescription: {
    marginTop: 10,
    fontSize: 13,
    color: "#ffffff",
    opacity: 0.9,
    lineHeight: 20,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statTile: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 12,
    gap: 6,
  },
  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 21,
    color: theme.colors.text,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    fontWeight: "700",
  },
  sectionTitle: {
    marginTop: 8,
    fontSize: 14,
    color: theme.colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.7,
    fontWeight: "700",
  },
  rowCard: {
    backgroundColor: "#ffffff",
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 12,
    gap: 4,
  },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  rowTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
  },
  rowBadge: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },
  rowMeta: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  alertCard: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 12,
  },
  alertBody: {
    flex: 1,
    gap: 2,
  },
  alertTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  alertMeta: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: theme.colors.background,
  },
  errorWrapper: {
    flex: 1,
    padding: 16,
    gap: 12,
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },
});
