import { ScrollView, Text, View } from "react-native";

import { EmptyState } from "@/components/feedback/EmptyState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { Button } from "@/components/ui/Button";
import { DashboardAlerts } from "@/modules/dashboard/components/DashboardAlerts";
import { DashboardSummaryCard } from "@/modules/dashboard/components/DashboardSummaryCard";
import { MonthlyFinancialSummary } from "@/modules/dashboard/components/MonthlyFinancialSummary";
import { TodayAppointments } from "@/modules/dashboard/components/TodayAppointments";
import { UpcomingAppointments } from "@/modules/dashboard/components/UpcomingAppointments";
import { useDashboard } from "@/modules/dashboard/hooks/useDashboard";
import {
  formatDashboardDate,
  formatDashboardTime,
} from "@/modules/dashboard/utils/dashboard-calculations";

import { styles } from "./DashboardScreen.styles";

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
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.generatedAt}>
        Atualizado em {formatDashboardDate(data.generatedAt)} às{" "}
        {formatDashboardTime(data.generatedAt)}
      </Text>

      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <DashboardSummaryCard
            title="Total de pacientes"
            value={String(data.summary.totalPatients)}
          />
        </View>
        <View style={styles.summaryCard}>
          <DashboardSummaryCard
            title="Agendamentos hoje"
            value={String(data.summary.appointmentsToday)}
          />
        </View>
        <View style={styles.summaryCard}>
          <DashboardSummaryCard
            title="Concluídos no mês"
            value={String(data.summary.appointmentsCompletedMonth)}
          />
        </View>
        <View style={styles.summaryCard}>
          <DashboardSummaryCard
            title="Saldo do mês"
            value={formatMoney(data.summary.monthBalance)}
            accentColor={data.summary.monthBalance >= 0 ? "#1f4db8" : "#b91c1c"}
          />
        </View>
        <View style={styles.summaryCard}>
          <DashboardSummaryCard
            title="Entradas no mês"
            value={formatMoney(data.summary.monthEntries)}
            accentColor="#0f766e"
          />
        </View>
        <View style={styles.summaryCard}>
          <DashboardSummaryCard
            title="Saídas no mês"
            value={formatMoney(data.summary.monthExits)}
            accentColor="#b91c1c"
          />
        </View>
      </View>

      <TodayAppointments items={data.todayAppointments} />
      <UpcomingAppointments items={data.upcomingAppointments} />
      <MonthlyFinancialSummary
        data={data.monthlyFinancial}
        formatMoney={formatMoney}
      />
      <DashboardAlerts alerts={data.alerts} />
    </ScrollView>
  );
}
